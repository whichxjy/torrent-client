class Handshake {
  constructor (myPeerID, infoHash) {
    this.pstr = 'BitTorrent protocol'
    this.infoHash = infoHash
    this.myPeerID = myPeerID
  }
}

const serialize = (handshake) => {
  return Buffer.concat([
    Buffer.from([handshake.pstr.length]),
    Buffer.from(handshake.pstr),
    Buffer.alloc(8),
    handshake.infoHash,
    handshake.myPeerID
  ])
}

const read = async (socket) => {
  return socket.read(10)
}

module.exports = {
  Handshake,
  serialize,
  read
}
