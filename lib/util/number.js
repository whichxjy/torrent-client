/* global BigInt */

// convert a number to uint 32
const toUint32 = (num) => Number(BigInt.asUintN(32, BigInt(num)))

// convert a uint 32 to 4 bytes
const uint32ToBytes = (num) => {
  return Buffer.from([
    (num & 0xFF000000) >> 24,
    (num & 0x00FF0000) >> 16,
    (num & 0x0000FF00) >> 8,
    (num & 0x000000FF) >> 0
  ])
}

// convert 4 bytes to a uint 32
const bytesToUint32 = (bytes) => {
  return (
    (bytes[bytes.length - 1] << 0) |
    (bytes[bytes.length - 2] << 8) |
    (bytes[bytes.length - 3] << 16) |
    (bytes[bytes.length - 4] << 24)
  )
}

module.exports = {
  toUint32,
  uint32ToBytes,
  bytesToUint32
}
