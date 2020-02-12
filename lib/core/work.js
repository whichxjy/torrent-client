const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')
const message = require('./message')

class Worker {
  constructor (peer, infoHash, myPeerID) {
    return (async () => {
      try {
        this.socket = new PromiseSocket()
        this.socket.setTimeout(3000)
        await this.socket.connect(peer.port, peer.ip)
        await startHandshake(this.socket, infoHash, myPeerID)
        this.bitfield = await receiveBitfield(this.socket)
        this.peer = peer
        this.infoHash = infoHash
        this.myPeerID = myPeerID
      } catch (err) {
        this.socket.destroy()
        throw err
      }
      return this
    })()
  }
}

// start handshake with the socket
const startHandshake = async (socket, infoHash, myPeerID) => {
  // request handshake
  const reqHandshake = new handshake.Handshake(infoHash, myPeerID)
  await socket.write(handshake.serialize(reqHandshake))
  // response handshake
  const resHandshake = await handshake.read(socket)
  if (!resHandshake.infoHash.equals(infoHash)) {
    throw new Error('Wrong info hash')
  }
}

// receive bitfield message from the socket
const receiveBitfield = async (socket) => {
  // read message
  const resMessage = await message.read(socket)
  if (resMessage.id !== message.BITFIELD) {
    throw new Error('No bitfield message received')
  }
  return resMessage.payload
}

// send a unchoke message to the worker
const sendUnchoke = async (worker) => {
  const msg = new message.Message(message.UNCHOKE)
  await worker.socket.write(message.serialize(msg))
}

// send an interested message to the worker
const sendInterested = async (worker) => {
  const msg = new message.Message(message.INTERESTED)
  await worker.socket.write(message.serialize(msg))
}

module.exports = {
  Worker,
  sendUnchoke,
  sendInterested
}
