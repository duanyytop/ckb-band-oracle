const BN = require('bn.js')
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

const intToHex = num => {
  let hex = num.toString(16)
  return hex.length % 2 === 1 ? `0${hex}` : hex
}

const intToU8 = num => {
  if (typeof num !== 'number') {
    throw new Error('Invalid data type')
  }
  const u8 = num.toString(16)
  return `${'0'.repeat(8 - u8.length)}${u8}`
}

const u8ToInt = hex => {
  if (typeof hex !== 'string' || !hex.startsWith('0x')) {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const intToU16 = num => {
  if (typeof num !== 'number') {
    throw new Error('Invalid data type')
  }
  const u16 = num.toString(16)
  return `${'0'.repeat(16 - u16.length)}${u16}`
}

const u16ToInt = hex => {
  if (typeof hex !== 'string' || !hex.startsWith('0x')) {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const generateBandData = (price, index) => {
  const timestamp = Math.floor(new Date().getTime() / 1000)
  return `0x${BAND_SYMBOL}${intToHex(index)}${intToU8(timestamp)}${intToU16(price)}`
}

module.exports = {
  remove0x,
  containBandData,
  generateBandData,
  intToU8,
  u8ToInt,
  intToU16,
  u16ToInt,
}
