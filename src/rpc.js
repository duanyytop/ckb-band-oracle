const CKB = require('@nervosnetwork/ckb-sdk-core').default
const fetch = require('node-fetch')
const BN = require('bn.js')
const { CKB_INDEXER_URL, CKB_NODE_URL, PRI_KEY } = require('./const')
const { remove0x } = require('./utils')

const ckb = new CKB(CKB_NODE_URL)
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY)
const ARGS = '0x' + ckb.utils.blake160(PUB_KEY, 'hex')
const FEE = new BN(100000)
const EACH_CAPACITY = new BN(20000000000)

const secp256k1LockScript = async () => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    codeHash: secp256k1Dep.codeHash,
    hashType: secp256k1Dep.hashType,
    args: ARGS,
  }
}

const getCells = async () => {
  const lock = await secp256k1LockScript(ARGS)
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: lock.codeHash,
          hash_type: lock.hashType,
          args: lock.args,
        },
        script_type: 'lock',
      },
      'asc',
      '0x3e8',
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res = await fetch(CKB_INDEXER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    res = await res.json()
    return res.result.objects
  } catch (error) {
    console.error('error', error)
  }
}

const collectInputs = (cells, capacity) => {
  let inputs = []
  let sum = new BN(0)
  cells.forEach(cell => {
    inputs.push({
      previousOutput: {
        txHash: cell.out_point.tx_hash,
        index: cell.out_point.index,
      },
      since: '0x0',
    })
    sum = sum.add(new BN(remove0x(cell.output.capacity), 'hex'))
    if (sum.add(FEE).cmp(capacity) >= 0) {
      return
    }
  })
  if (sum.add(FEE).cmp(capacity) < 0) {
    throw Error('Capacity not enough')
  }
  return inputs
}

const multiOutputs = async length => {
  if (length <= 0) return []
  const output = {
    capacity: `0x${EACH_CAPACITY.toString(16)}`,
    lock: await secp256k1LockScript(),
    type: null,
  }
  let outputs = []
  let len = length
  while (len--) {
    outputs.push(output)
  }
  return outputs
}

const multiOutputsData = length => {
  if (length <= 0) return []
  let data = []
  let len = length
  while (len--) {
    data.push('0x')
  }
  return data
}

const splitMultiLiveCells = async length => {
  const liveCells = await getCells()
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  const rawTx = {
    version: '0x0',
    cellDeps: [{ outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }],
    headerDeps: [],
    inputs: collectInputs(liveCells, EACH_CAPACITY.mul(new BN(length))),
    outputs: await multiOutputs(length),
    outputsData: multiOutputsData(length),
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
  const txHash = await ckb.rpc.sendTransaction(signedTx)
  console.info(`Transaction has been sent with tx hash ${txHash}`)
  return txHash
}

module.exports = {
  getCells,
  splitMultiLiveCells,
}
