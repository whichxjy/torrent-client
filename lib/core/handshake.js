class Handshake {
  constructor (peerID, infoHash) {
    this.pstr = 'BitTorrent protocol'
    this.peerID = peerID
    this.infoHash = infoHash
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

const read = async (socket) => {
  // read pstr length
  const pstrLengthBuffer = await socket.read(1)
  const pstrLength = parseInt(pstrLengthBuffer[0].toString())
  // read pstr
  await socket.read(pstrLength)
  // read reserved bytes
  await socket.read(8)
  // read info hash
  const infoHash = await socket.read(20)
  // read peer id
  const peerID = await socket.read(20)
  return new Handshake(peerID, infoHash)
}

module.exports = {
  Handshake,
  serialize,
  read
}
