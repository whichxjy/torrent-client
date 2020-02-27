// check if a bitfield has a particular index set
const hasPiece = (bitfield, index) => {
  const byteIndex = parseInt(index / 8)
  if (byteIndex < 0 || byteIndex >= bitfield.length) {
    return false
  } else {
    const offsetInByte = parseInt(index % 8)
    return ((bitfield[byteIndex] >> (7 - offsetInByte)) & 1) === 1
  }
}

// set a bit in the bitfield
const setPrice = (bitfield, index) => {
  const byteIndex = parseInt(index / 8)
  if (byteIndex >= 0 && byteIndex < bitfield.length) {
    const offsetInByte = parseInt(index % 8)
    bitfield[byteIndex] |= 1 << (7 - offsetInByte)
  }
}

module.exports = { hasPiece, setPrice }
