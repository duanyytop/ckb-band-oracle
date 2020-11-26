const fetch = require('node-fetch')
const endpoint = 'http://guanyu-testnet3-query.bandchain.org'

const ask_count = 16
const min_count = 10

/**
 * {
    pair: 'BTC/USD',
    rate: 13697.800000000001,
    updated: { base: 1604295641, quote: 1604295671 }
  },
 */

const fetchSymbols = async () => {
  let res = await fetch(endpoint + `/oracle/price_symbols?ask_count=${ask_count}&min_count=${min_count}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  res = await res.json()
  return res['result']
}

const fetchBandOracle = async symbols => {
  let res = await fetch(endpoint + '/oracle/request_prices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbols, ask_count, min_count }, null, '  '),
  })
  res = await res.json()
  const pricesWithTimestamps = res['result'].map(({ px, multiplier, resolve_time }) => ({
    price: Math.round((px * 1e6) / multiplier),
    timestamp: Number(resolve_time),
  }))

  return { pricesWithTimestamps }
}

module.exports = {
  fetchSymbols,
  fetchBandOracle,
}
