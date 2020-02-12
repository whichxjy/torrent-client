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
  for (let i = 0; i < payloadLength; i++) {
    chunks.push(await socket.read(1))
  }
  const payload = Buffer.concat(chunks)
  return new Message(messageID, payload)
}

// send a "choke" message to the socket
const sendChoke = async (socket) => socket.write(serialize(new Message(CHOKE)))

// send a "unchoke" message to the socket
const sendUnchoke = async (socket) => socket.write(serialize(new Message(UNCHOKE)))

// send an "interested" message to the socket
const sendInterested = async (socket) => socket.write(serialize(new Message(INTERESTED)))

// send a "not interested" message to the socket
const sendNotInterested = async (socket) => socket.write(serialize(new Message(NOT_INTERESTED)))

// create a "have" message
const createHave = (index) => new Message(HAVE, uint32ToBytes(toUint32(index)))

// send a "have" message to the socket
const sendHave = async (socket, index) => {
  const haveMessage = createHave(index)
  return socket.write(serialize(haveMessage))
}

// create a "request" message
const createRequest = (index, begin, length) => {
  const payload = Buffer.concat([
    uint32ToBytes(toUint32(index)),
    uint32ToBytes(toUint32(begin)),
    uint32ToBytes(toUint32(length))
  ])
  return new Message(REQUEST, payload)
}

// send a "request" message to the socket
const sendRequest = async (socket, index, begin, length) => {
  const requestMessage = createRequest(index, begin, length)
  return socket.write(serialize(requestMessage))
}

// parse a "have" message and get the index
const parseHave = (haveMessage) => {
  if (haveMessage.id !== HAVE) {
    throw new Error('Not a have message')
  } else if (haveMessage.payload.length !== 4) {
    throw new Error('The length of the payload is wrong')
  } else {
    return bytesToUint32(haveMessage.payload)
  }
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
  sendChoke,
  sendUnchoke,
  sendInterested,
  sendNotInterested,
  createHave,
  sendHave,
  createRequest,
  sendRequest,
  parseHave
}
