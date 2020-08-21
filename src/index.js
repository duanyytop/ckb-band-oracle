const BandChain = require('@bandprotocol/bandchain.js')
const { Obi } = require('@bandprotocol/obi.js')
const endpoint = 'http://poa-api.bandchain.org'

const fetchBandOracle = async () => {
  const bandChain = new BandChain(endpoint)
  const oracleScript = await bandChain.getOracleScript(8)
  try {
    const minCount = 3
    const askCount = 4
    const mnemonic =
      'dune creek radar hold reward trial carry word wear mammal blossom naive museum reunion crop pet resemble toilet outer prevent atom pond expose dwarf'
    const requestId = await bandChain.submitRequestTx(
      oracleScript,
      {
        symbols: ['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND'],
        multiplier: 1000000,
      },
      { minCount, askCount },
      mnemonic,
    )
    const finalResult = await bandChain.getRequestResult(requestId)
    const obi = new Obi(oracleScript.schema)
    const { pxs: prices } = obi.decodeOutput(Buffer.from(finalResult.response_packet_data.result, 'base64'))
    console.log(prices)
  } catch (error) {
    console.error('Data request failed')
  }
}

fetchBandOracle()
