const { BAND_SYMBOL } = require('./const')

const remove0x = hex => {
  if (hex.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

const containBandData = cells => {
  let result = false
  for (let cell of cells) {
    if (remove0x(cell.output_data).startsWith(BAND_SYMBOL)) {
      result = true
      break
    }
  }
  return result
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
  if (typeof hex !== 'string') {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const intToU64 = num => {
  if (typeof num !== 'number' && typeof num !== 'bigint') {
    throw new Error('Invalid data type')
  }
  const u64 = num.toString(16)
  return `${'0'.repeat(16 - u64.length)}${u64}`
}

const u64ToInt = hex => {
  if (typeof hex !== 'string') {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const generateBandData = (price, index, timestamp) => {
  return `0x${BAND_SYMBOL}${intToHex(index)}${intToU32(timestamp)}${intToU64(price)}`
}

const parseBandData = data => {
  const temp = remove0x(data)
  const start = BAND_SYMBOL.length
  const index = parseInt(temp.substring(start, start + 2), 16)
  const timestamp = u32ToInt(temp.substring(start + 2, start + 10))
  const price = u64ToInt(temp.substring(start + 10))
  return { index, timestamp, price }
}

module.exports = {
  remove0x,
  containBandData,
  intToU32,
  u32ToInt,
  intToU64,
  u64ToInt,
  generateBandData,
  parseBandData,
}
