/* global BigInt */

// convert a number to uint 32
const toUint32 = (num) => Number(BigInt.asUintN(32, BigInt(num)))

// convert a uint 32 to 4 bytes
const uint32ToBytes = (num) => {
  return new Uint8Array([
    (num & 0xFF000000) >> 24,
    (num & 0x00FF0000) >> 16,
    (num & 0x0000FF00) >> 8,
    (num & 0x000000FF) >> 0
  ])
}

module.exports = { toUint32, uint32ToBytes }
