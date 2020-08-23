require('dotenv').config()
const CKB_NODE_URL = 'https://prototype.ckbapp.dev/testnet/rpc'
const CKB_INDEXER_URL = 'https://prototype.ckbapp.dev/testnet/indexer'
const PRI_KEY = process.env.PRIVATE_KEY

const BAND_SYMBOL = '62616e64' // Hex of "band"

module.exports = {
  CKB_NODE_URL,
  CKB_INDEXER_URL,
  PRI_KEY,
  BAND_SYMBOL,
}
