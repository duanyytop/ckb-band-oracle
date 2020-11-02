const BandChain = require('@bandprotocol/bandchain.js')
const endpoint = 'http://poa-api.bandchain.org'

const SYMBOLS = ['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND', 'CKB']

/**
 * {
    pair: 'BTC/USD',
    rate: 13697.800000000001,
    updated: { base: 1604295641, quote: 1604295671 }
  },
 */

const fetchBandOracle = async () => {
  const bandChain = new BandChain(endpoint)
  const refs = await bandChain.getReferenceData(SYMBOLS.map(symbol => `${symbol}/USD`))
  const prices = refs.map(ref => ref.rate * 10 ** 6)
  return { prices, timestamp: refs[0].updated.base }
}

module.exports = {
  fetchBandOracle,
  SYMBOLS,
}
