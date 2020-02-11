const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')

class Worker {
  constructor (peer, infoHash, myPeerID) {
    return (async () => {
      this.socket = new PromiseSocket()
      this.socket.setTimeout(3000)
      await this.socket.connect(peer.port, peer.ip)
      await startHandshake(this.socket, infoHash, myPeerID)
      return this
    })()
  }
}

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

module.exports = { Worker }
