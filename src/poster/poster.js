const { getCells, generateEmptyLiveCells, generateOracleLiveCells, updateOracleLiveCells } = require('./rpc')
const { containBandData } = require('../utils/utils')
const { fetchSymbols, fetchBandOracle } = require('./band')

const postBandOracle = async () => {
  const liveCells = await getCells()
  const symbols = await fetchSymbols()
  const length = symbols.length
  if (liveCells.length < length) {
    console.info('Generate Live Cells')
    await generateEmptyLiveCells(liveCells, length)
  } else if (!containBandData(liveCells)) {
    console.info('Post Oracle to Live Cells Data')
    const { pricesWithTimestamps } = await fetchBandOracle(symbols)
    await generateOracleLiveCells(liveCells, pricesWithTimestamps)
  } else {
    console.info('Update Oracle Cells Data')
    const { pricesWithTimestamps } = await fetchBandOracle(symbols)
    await updateOracleLiveCells(liveCells, pricesWithTimestamps)
  }
}

module.exports = {
  postBandOracle,
}
