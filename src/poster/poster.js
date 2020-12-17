const { getCells, generateEmptyLiveCells, generateOracleLiveCells, updateOracleLiveCells } = require('./rpc')
const { containBandData } = require('../utils/utils')
const { fetchBandOracle } = require('./band')

const postBandOracle = async () => {
  const liveCells = await getCells()
  const { pricesWithTimestamps } = await fetchBandOracle()
  const length = pricesWithTimestamps.length
  if (liveCells.length < length) {
    console.info('Generate Live Cells')
    await generateEmptyLiveCells(liveCells, length)
  } else if (!containBandData(liveCells)) {
    console.info('Post Oracle to Live Cells Data')
    await generateOracleLiveCells(liveCells, pricesWithTimestamps)
  } else {
    console.info('Update Oracle Cells Data')
    await updateOracleLiveCells(liveCells, pricesWithTimestamps)
  }
}

module.exports = {
  postBandOracle,
}
