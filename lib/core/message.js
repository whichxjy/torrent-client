/* global BigInt */

// 0 - choke
const CHOKE = 0
// 1 - unchoke
const UNCHOKE = 1
// 2 - interested
const INTERESTED = 2
// 3 - not interested
const NOT_INTERESTED = 3
// 4 - have
const HAVE = 4
// 5 - bitfield
const BITFIELD = 5
// 6 - request
const REQUEST = 6
// 7 - piece
const PIECE = 7
// 8 - cancel
const CANCEL = 8

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

// check if a message has the payload
const hasPayload = (messgae) => Object.prototype.hasOwnProperty.call(messgae, 'payload')

// serialize a message into a buffer of the form <length><message id><payload>
const serialize = (message) => {
  if (hasPayload(message)) {
    const length = toUint32(1 + message.payload.length)
    const lengthBuffer = uint32ToBytes(length)
    return Buffer.concat([lengthBuffer, new Uint8Array([message.id]), message.payload])
  } else {
    const length = 1
    const lengthBuffer = uint32ToBytes(length)
    return Buffer.concat([lengthBuffer, new Uint8Array([message.id])])
  }
}

// send a unchoke message to the peer
const sendUnchoke = async (socket) => {
  const msg = {
    id: UNCHOKE
  }
  await socket.write(serialize(msg))
}

// send a interested message to the peer
const sendInterested = async (socket) => {
  const msg = {
    id: INTERESTED
  }
  await socket.write(serialize(msg))
}

module.exports = {
  CHOKE,
  UNCHOKE,
  INTERESTED,
  NOT_INTERESTED,
  HAVE,
  BITFIELD,
  REQUEST,
  PIECE,
  CANCEL,
  serialize,
  sendInterested,
  sendUnchoke
}
