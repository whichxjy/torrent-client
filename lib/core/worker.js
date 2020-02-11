const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')

class Worker {
  constructor (peer, myPeerID, infoHash) {
    return (async () => {
      this.socket = new PromiseSocket()
      this.socket.setTimeout(2000)
      await this.socket.connect(peer.port, peer.ip)
      await startHandshake(this.socket, myPeerID, infoHash)
      return this
    })()
  }
}

const startHandshake = async (socket, myPeerID, infoHash) => {
  const req = new handshake.Handshake(myPeerID, infoHash)
  await socket.write(handshake.serialize(req))
}

module.exports = { Worker }
