const { intToU32, u32ToInt, intToU64, u64ToInt } = require('../utils/utils')

describe('Utils tests', () => {
  it('intToU32', async () => {
    expect(intToU32(1598165700)).toBe('5f4212c4')
  })

  it('u32ToInt', async () => {
    expect(u32ToInt('0x5f4212c4')).toBe(1598165700)
  })

  it('intToU64', async () => {
    expect(intToU64(1598165700)).toBe('000000005f4212c4')
    expect(intToU64(11592810000)).toBe('00000002b2fc3e10')
  })

  it('u64ToInt', async () => {
    expect(u64ToInt('0x00000002b2fc3e10')).toBe(11592810000)
  })
})
