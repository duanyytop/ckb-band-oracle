const fetch = require('node-fetch')
const endpoint = 'http://guanyu-testnet3-query.bandchain.org'

const SYMBOLS = ['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND', 'CKB']
const ask_count = 16
const min_count = 10

/**
 * {
    pair: 'BTC/USD',
    rate: 13697.800000000001,
    updated: { base: 1604295641, quote: 1604295671 }
  },
 */

const fetchBandOracle = async () => {
  let res = await fetch(endpoint + `/oracle/request_prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbols: SYMBOLS, ask_count, min_count }, null, '  '),
  })
  res = await res.json()
  const pricesWithTimestamps = res['result'].map(({ px, multiplier, resolve_time }) => ({
    price: Math.round((px * 1e6) / multiplier),
    timestamp: Number(resolve_time),
  }))

  return { pricesWithTimestamps }
}

module.exports = {
  fetchBandOracle,
  SYMBOLS,
}
