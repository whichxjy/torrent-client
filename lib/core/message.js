const { toUint32, uint32ToBytes, bytesToUint32 } = require('../util/number')

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

class Message {
  constructor (id, payload) {
    this.id = id
    if (payload !== undefined) {
      this.payload = payload
    }
  }
}

// check if a message has the payload
const hasPayload = (message) => Object.prototype.hasOwnProperty.call(message, 'payload')

// serialize a message into a buffer of the form <length><message id><payload>
const serialize = (message) => {
  if (hasPayload(message)) {
    const length = toUint32(1 + message.payload.length)
    const lengthBuffer = uint32ToBytes(length)
    return Buffer.concat([lengthBuffer, Buffer.from([message.id]), message.payload])
  } else {
    const length = 1
    const lengthBuffer = uint32ToBytes(length)
    return Buffer.concat([lengthBuffer, Buffer.from([message.id])])
  }
}

// read message from the socket
const read = async (socket) => {
  // read length
  const lengthBuffer = await socket.read(4)
  const length = bytesToUint32(lengthBuffer)
  if (length === undefined || length === 0) {
    throw new Error('No message received')
  }
  // read message id
  const messageID = parseInt((await socket.read(1))[0])
  // read payload
  const payloadLength = length - 1
  const chunks = []
  for (const _ of Array(payloadLength).keys()) {
    chunks.push(await socket.read(1))
  }
  const payload = Buffer.concat(chunks)
  return new Message(messageID, payload)
}

// send a unchoke message to the peer
const sendUnchoke = async (socket) => {
  await socket.write(serialize(new Message(UNCHOKE)))
}

// send a interested message to the peer
const sendInterested = async (socket) => {
  await socket.write(serialize(new Message(INTERESTED)))
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
  Message,
  serialize,
  read,
  sendInterested,
  sendUnchoke
}
