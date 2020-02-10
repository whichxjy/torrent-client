/* global BigInt */

// 0 - choke
const msgChoke = 0
// 1 - unchoke
const msgUnchoke = 1
// 2 - interested
const msgInterested = 2
// 3 - not interested
const msgNotInterested = 3
// 4 - have
const msgHave = 4
// 5 - bitfield
const msgBitfield = 5
// 6 - request
const msgRequest = 6
// 7 - piece
const msgPiece = 7
// 8 - cancel
const msgCancel = 8

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

// serialize a message into a buffer of the form <length><message id><payload>
const serializeMessage = (message) => {
  const length = toUint32(1 + message.payload.length)
  const lengthBuffer = uint32ToBytes(length)
  return Buffer.concat([lengthBuffer, new Uint8Array([message.id]), message.payload])
}

module.exports = {
  msgChoke,
  msgUnchoke,
  msgInterested,
  msgNotInterested,
  msgHave,
  msgBitfield,
  msgRequest,
  msgPiece,
  msgCancel,
  serializeMessage
}
