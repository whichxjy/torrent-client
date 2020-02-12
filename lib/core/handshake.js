class Handshake {
  constructor (infoHash, peerID) {
    this.pstr = 'BitTorrent protocol'
    this.infoHash = infoHash
    this.peerID = peerID
  }
}

// serialize the handshake
const serialize = (handshake) => {
  return Buffer.concat([
    Buffer.from([handshake.pstr.length]),
    Buffer.from(handshake.pstr),
    Buffer.alloc(8),
    handshake.infoHash,
    handshake.peerID
  ])
}

// read the handshake info from the socket
const read = async (socket) => {
  // read pstr length
  const pstrLengthBuffer = await socket.read(1)
  if (pstrLengthBuffer === undefined) {
    throw new Error('No response')
  }
  const pstrLength = parseInt(pstrLengthBuffer[0].toString())
  // read pstr
  await socket.read(pstrLength)
  // read reserved bytes
  await socket.read(8)
  // read info hash
  const infoHash = await socket.read(20)
  // read peer id
  const peerID = await socket.read(20)
  return new Handshake(infoHash, peerID)
}

module.exports = {
  Handshake,
  serialize,
  read
}
