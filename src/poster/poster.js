const { getCells, generateEmptyLiveCells, generateOracleLiveCells, updateOracleLiveCells } = require('./rpc')
const { containBandData } = require('../utils/utils')
const { SYMBOLS, fetchBandOracle } = require('./band')

const postBandOracle = async () => {
  const liveCells = await getCells()
  const length = SYMBOLS.length
  if (liveCells.length < length) {
    console.info('Generate Live Cells')
    await generateEmptyLiveCells(liveCells, length)
  } else if (!containBandData(liveCells)) {
    console.info('Post Oracle to Live Cells Data')
    const { prices, timestamp } = await fetchBandOracle()
    await generateOracleLiveCells(liveCells, prices, timestamp)
  } else {
    console.info('Update Oracle Cells Data')
    const { prices, timestamp } = await fetchBandOracle()
    await updateOracleLiveCells(liveCells, prices, timestamp)
  }
}

module.exports = {
  postBandOracle,
}
