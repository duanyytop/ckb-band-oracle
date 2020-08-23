const BandChain = require('@bandprotocol/bandchain.js')
const endpoint = 'http://poa-api.bandchain.org'

const SYMBOLS = ['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND']

const oracleScriptId = 8
const params = {
  symbols: SYMBOLS,
  multiplier: 1000000,
}
const validatorCounts = {
  minCount: 3,
  askCount: 4,
}

const fetchBandOracle = async () => {
  const bandchain = new BandChain(endpoint)
  const oracleScript = await bandchain.getOracleScript(oracleScriptId)
  const { result, resolve_time } = await bandchain.getLastMatchingRequestResult(oracleScript, params, validatorCounts)
  return { prices: result.pxs, timestamp: resolve_time }
}

module.exports = {
  fetchBandOracle,
  SYMBOLS,
}
