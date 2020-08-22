const { BAND_SYMBOL } = require('./const')

const remove0x = hex => {
  if (hex.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

const containBandData = cells => {
  cells.forEach(cell => {
    if (remove0x(cell.output_data).startsWith(BAND_SYMBOL)) {
      return true
    }
  })
  return false
}

module.exports = {
  remove0x,
  containBandData,
}
