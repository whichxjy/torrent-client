const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')
const message = require('./message')
const { HandshakeError } = require('./error')

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
        this.isChoking = true
      } catch (err) {
        this.socket.destroy()
        throw new HandshakeError(err.message)
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

// send a "choke" message to the worker
const sendChoke = async (worker) => message.sendChoke(worker.socket)

// send a "unchoke" message to the worker
const sendUnchoke = async (worker) => message.sendUnchoke(worker.socket)

// send an "interested" message to the worker
const sendInterested = async (worker) => message.sendInterested(worker.socket)

// send a "not interested" message to the worker
const sendNotInterested = async (worker) => message.sendNotInterested(worker.socket)

module.exports = {
  Worker,
  sendChoke,
  sendUnchoke,
  sendInterested,
  sendNotInterested
}
