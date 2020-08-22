const { getCells, splitMultiLiveCells } = require('./rpc')
const { containBandData } = require('./utils')

const postBandOracle = async () => {
  const liveCells = await getCells()
  if (!containBandData(liveCells)) {
    await splitMultiLiveCells(10)
  }
}

module.exports = {
  postBandOracle,
}
