const { getCells, generateEmptyLiveCells } = require('./rpc')
const { containBandData } = require('./utils')

const postBandOracle = async () => {
  const liveCells = await getCells()
  if (!containBandData(liveCells)) {
    await generateEmptyLiveCells(liveCells, 10)
  }
}

module.exports = {
  postBandOracle,
}
