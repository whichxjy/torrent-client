const bytesToPeers = (bytes) => {
  const peerSize = 6

  if (bytes.length % peerSize !== 0) {
    throw new Error('The length of peer bytes is wrong.')
  }

  const peers = []
  const peersNum = bytes.length / peerSize

  for (const i of Array(peersNum).keys()) {
    const startIndex = i * 6
    const ip = bytes.slice(startIndex, startIndex + 4).join('.')
    const port = (bytes[startIndex + 4] << 8) + bytes[startIndex + 5]
    const peer = ip + ':' + port
    peers.push(peer)
  }

  return peers
}

module.exports = { bytesToPeers }
