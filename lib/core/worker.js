const message = require('./message')
const { PromiseSocket } = require('promise-socket')

class Worker {
  constructor (peer) {
    return (async () => {
      this.socket = new PromiseSocket()
      this.socket.setTimeout(2000)
      await this.socket.connect(peer.port, peer.ip)

      await message.sendUnchoke(this.socket)
      await message.sendInterested(this.socket)

      return this
    })()
  }
}

module.exports = { Worker }
