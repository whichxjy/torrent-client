const MY_PEER_ID = Buffer.from([...Array(20).keys()].map(num => num + 1))
const MY_PEER_ID_ENCODED = '%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F%10%11%12%13%14'

class Peer {
  constructor (ip, port) {
    this.ip = ip
    this.port = port
  }
}

// convert bytes to peers
const bytesToPeers = (bytes) => {
  const peerSize = 6

  if (bytes.length % peerSize !== 0) {
    throw new Error('The length of peer bytes is wrong.')
  }

  const peers = []
  const peersNum = bytes.length / peerSize

  for (let i = 0; i < peersNum; i++) {
    const startIndex = i * 6
    const ip = bytes.slice(startIndex, startIndex + 4).join('.')
    const port = (bytes[startIndex + 4] << 8) + bytes[startIndex + 5]
    peers.push(new Peer(ip, port))
  }

  return peers
}

module.exports = {
  MY_PEER_ID,
  MY_PEER_ID_ENCODED,
  bytesToPeers
}
