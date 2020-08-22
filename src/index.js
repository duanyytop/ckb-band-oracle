const { postBandOracle } = require('./poster')

const startPoster = async () => {
  await postBandOracle()
}

startPoster()
