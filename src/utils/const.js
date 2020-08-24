require('dotenv').config()
const CKB_NODE_URL = 'https://prototype.ckbapp.dev/testnet/rpc'
const CKB_INDEXER_URL = 'https://prototype.ckbapp.dev/testnet/indexer'
const CKB_WS_URL = 'wss://ws-prototype.ckbapp.dev/testnet/rpc'
const PRI_KEY = process.env.PRIVATE_KEY

const BAND_SYMBOL = '62616e64' // Hex of "band"
const POST_INTERVAL = 60000

module.exports = {
  CKB_NODE_URL,
  CKB_INDEXER_URL,
  CKB_WS_URL,
  PRI_KEY,
  BAND_SYMBOL,
  POST_INTERVAL,
}
