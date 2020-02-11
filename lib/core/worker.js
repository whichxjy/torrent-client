const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')

class Worker {
  constructor (peer, peerID, infoHash) {
    return (async () => {
      this.socket = new PromiseSocket()
      this.socket.setTimeout(2000)
      await this.socket.connect(peer.port, peer.ip)
      await startHandshake(this.socket, peerID, infoHash)
      return this
    })()
  }
}

const startHandshake = async (socket, peerID, infoHash) => {
  const req = new handshake.Handshake(peerID, infoHash)
  await socket.write(handshake.serialize(req))
}

module.exports = { Worker }
