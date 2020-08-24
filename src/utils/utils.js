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

const intToU32 = num => {
  if (typeof num !== 'number') {
    throw new Error('Invalid data type')
  }
  const u32 = num.toString(16)
  return `${'0'.repeat(8 - u32.length)}${u32}`
}

const u32ToInt = hex => {
  if (typeof hex !== 'string' || !hex.startsWith('0x')) {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const intToU64 = num => {
  if (typeof num !== 'number') {
    throw new Error('Invalid data type')
  }
  const u64 = num.toString(16)
  return `${'0'.repeat(16 - u64.length)}${u64}`
}

const u64ToInt = hex => {
  if (typeof hex !== 'string' || !hex.startsWith('0x')) {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const generateBandData = (price, index) => {
  const timestamp = Math.floor(new Date().getTime() / 1000)
  return `0x${BAND_SYMBOL}${intToHex(index)}${intToU32(timestamp)}${intToU64(price)}`
}

module.exports = {
  remove0x,
  containBandData,
  generateBandData,
  intToU32,
  u32ToInt,
  intToU64,
  u64ToInt,
}
