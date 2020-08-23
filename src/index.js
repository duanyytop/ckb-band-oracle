const { postBandOracle } = require('./poster/poster')

const startPoster = async () => {
  await postBandOracle()
}

startPoster()
