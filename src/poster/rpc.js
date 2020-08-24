const CKB = require('@nervosnetwork/ckb-sdk-core').default
const fetch = require('node-fetch')
const BN = require('bn.js')
const { CKB_INDEXER_URL, CKB_NODE_URL, PRI_KEY, BAND_SYMBOL } = require('../utils/const')
const { remove0x, generateBandData, parseBandData } = require('../utils/utils')

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

const collectInputs = (cells, needCapacity) => {
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
    if (sum.cmp(needCapacity.add(FEE)) >= 0) {
      return
    }
  })
  if (sum.cmp(needCapacity.add(FEE)) < 0) {
    throw Error('Capacity not enough')
  }
  return { inputs, capacity: sum }
}

const multiOutputs = async (inputCapacity, length) => {
  const lock = await secp256k1LockScript()
  if (length <= 0) return []
  const output = {
    capacity: `0x${EACH_CAPACITY.toString(16)}`,
    lock,
    type: null,
  }
  let outputs = []
  let len = length
  while (len--) {
    outputs.push(output)
  }
  const changeCapacity = inputCapacity.sub(FEE).sub(EACH_CAPACITY.mul(new BN(length)))
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock,
    type: null,
  })
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

const generateEmptyLiveCells = async (liveCells, length) => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  const { inputs, capacity } = collectInputs(liveCells, EACH_CAPACITY.mul(new BN(length)))
  const outputs = await multiOutputs(capacity, length)
  const rawTx = {
    version: '0x0',
    cellDeps: [{ outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }],
    headerDeps: [],
    inputs,
    outputs,
    outputsData: multiOutputsData(outputs.length),
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
  const txHash = await ckb.rpc.sendTransaction(signedTx)
  console.info(`Transaction has been sent with tx hash ${txHash}`)
  return txHash
}

const generateInput = cell => {
  return {
    previousOutput: {
      txHash: cell.out_point.tx_hash,
      index: cell.out_point.index,
    },
    since: '0x0',
  }
}

const generateOracleLiveCells = async (liveCells, prices) => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  const lock = await secp256k1LockScript()
  const pricesData = prices.map((price, index) => generateBandData(price, index))
  const requests = []
  liveCells
    .filter(cell => new BN(remove0x(cell.output.capacity), 16).cmp(EACH_CAPACITY) === 0)
    .forEach((cell, index) => {
      const rawTx = {
        version: '0x0',
        cellDeps: [{ outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }],
        headerDeps: [],
        inputs: [generateInput(cell)],
        outputs: [
          {
            capacity: `0x${EACH_CAPACITY.sub(FEE).toString(16)}`,
            lock,
            type: null,
          },
        ],
        outputsData: [pricesData[index]],
      }
      rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
      const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
      requests.push(['sendTransaction', signedTx])
    })
  const batch = ckb.rpc.createBatchRequest(requests)
  batch.exec().then(console.info)
}

const updateOracleLiveCells = async (liveCells, prices) => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  const lock = await secp256k1LockScript()
  const pricesData = prices.map((price, index) => generateBandData(price, index))
  const requests = []
  liveCells
    .filter(cell => remove0x(cell.output_data).startsWith(BAND_SYMBOL))
    .forEach(cell => {
      const { index } = parseBandData(cell.output_data)
      const rawTx = {
        version: '0x0',
        cellDeps: [{ outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }],
        headerDeps: [],
        inputs: [generateInput(cell)],
        outputs: [
          {
            capacity: `0x${new BN(remove0x(cell.output.capacity), 'hex').sub(FEE).toString(16)}`,
            lock,
            type: null,
          },
        ],
        outputsData: [pricesData[index]],
      }
      rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
      const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
      requests.push(['sendTransaction', signedTx])
    })
  const batch = ckb.rpc.createBatchRequest(requests)
  batch.exec().then(console.info)
}

module.exports = {
  getCells,
  generateEmptyLiveCells,
  generateOracleLiveCells,
  updateOracleLiveCells,
}
