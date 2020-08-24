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
  const bandChain = new BandChain(endpoint)
  const oracleScript = await bandChain.getOracleScript(oracleScriptId)
  const { result, resolve_time } = await bandChain.getLastMatchingRequestResult(oracleScript, params, validatorCounts)
  console.info(result, resolve_time)
  return { prices: result.pxs, timestamp: parseInt(resolve_time) }
}

module.exports = {
  fetchBandOracle,
  SYMBOLS,
}
