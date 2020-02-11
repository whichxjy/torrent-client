class Handshake {
  constructor (myPeerID, infoHash) {
    this.pstr = 'Computer World'
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

module.exports = { Handshake, serialize }
