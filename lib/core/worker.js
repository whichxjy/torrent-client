const { PromiseSocket } = require('promise-socket')
const handshake = require('./handshake')

class Worker {
  constructor (peer, myPeerID, infoHash) {
    return (async () => {
      this.socket = new PromiseSocket()
      this.socket.setTimeout(4000)
      await this.socket.connect(peer.port, peer.ip)
      await startHandshake(this.socket, myPeerID, infoHash)
      return this
    })()
  }
}

const startHandshake = async (socket, myPeerID, infoHash) => {
  // request handshake
  const reqHandshake = new handshake.Handshake(myPeerID, infoHash)
  await socket.write(handshake.serialize(reqHandshake))
  // response handshake
  const resHandshake = await handshake.read(socket)
  console.log(resHandshake)
}

module.exports = { Worker }
