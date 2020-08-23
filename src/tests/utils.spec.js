const { intToU8, u8ToInt, intToU16, u16ToInt } = require('../utils/utils')

describe('Utils tests', () => {
  it('intToU8', async () => {
    expect(intToU8(1598165700)).toBe('5f4212c4')
  })

  it('u8ToInt', async () => {
    expect(u8ToInt('0x5f4212c4')).toBe(1598165700)
  })

  it('intToU16', async () => {
    expect(intToU16(1598165700)).toBe('000000005f4212c4')
    expect(intToU16(11592810000)).toBe('00000002b2fc3e10')
  })

  it('u16ToInt', async () => {
    expect(u16ToInt('0x00000002b2fc3e10')).toBe(11592810000)
  })
})
