class Handshake {
  constructor (peerID, infoHash) {
    this.pstr = 'Computer World'
    this.infoHash = infoHash
    this.peerID = peerID
  }
}

const serialize = (handshake) => {
  return Buffer.concat([
    Buffer.from([handshake.pstr.length]),
    Buffer.from(handshake.pstr),
    Buffer.alloc(8),
    handshake.infoHash,
    handshake.peerID
  ])
}

module.exports = { Handshake, serialize }
