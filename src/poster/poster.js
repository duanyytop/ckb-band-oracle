const { getCells, generateEmptyLiveCells, generateOracleLiveCells } = require('./rpc')
const { containBandData } = require('../utils/utils')
const { SYMBOLS } = require('./band')

const postBandOracle = async () => {
  const liveCells = await getCells()
  const length = SYMBOLS.length
  if (liveCells.length < length) {
    await generateEmptyLiveCells(liveCells, length)
  } else if (!containBandData(liveCells)) {
    const prices = [11592810000, 391150000, 1008400, 24921000, 711550, 378600, 1674000, 15430405, 170369000, 11901599]
    await generateOracleLiveCells(liveCells, prices)
  }
}

module.exports = {
  postBandOracle,
}
