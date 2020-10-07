require('dotenv').config()
const CKB_NODE_URL = 'https://testnet.ckb.dev/rpc'
const CKB_INDEXER_URL = 'https://testnet.ckb.dev/indexer_rpc'
const CKB_WS_URL = 'https://ws-ckbrpc.ckbapp.dev/testnet/rpc'
const PRI_KEY = process.env.PRIVATE_KEY

const BAND_SYMBOL = '62616e64' // Hex of "band"

module.exports = {
  CKB_NODE_URL,
  CKB_INDEXER_URL,
  CKB_WS_URL,
  PRI_KEY,
  BAND_SYMBOL,
}
