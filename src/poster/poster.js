const { getCells, generateEmptyLiveCells, generateOracleLiveCells, updateOracleLiveCells } = require('./rpc')
const { containBandData } = require('../utils/utils')
const { SYMBOLS, fetchBandOracle } = require('./band')

const postBandOracle = async () => {
  const liveCells = await getCells()
  const length = SYMBOLS.length
  if (liveCells.length < length) {
    await generateEmptyLiveCells(liveCells, length)
  } else if (!containBandData(liveCells)) {
    const { prices } = await fetchBandOracle()
    await generateOracleLiveCells(liveCells, prices)
  } else {
    const { prices, timestamp } = await fetchBandOracle()
    await updateOracleLiveCells(liveCells, prices, timestamp)
  }
}

module.exports = {
  postBandOracle,
}
