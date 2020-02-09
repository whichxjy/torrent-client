const net = require('net')

const getPieceLength = (index, pieceLength, length) => {
  const start = pieceLength * index
  const end = Math.min(start + pieceLength, length)
  return end - start
}

// download file according to the torrent object
const download = async (torrent) => {
  console.log('Start download: ' + torrent.file.name)

  const pieceWorks = []

  for (const i of Array(torrent.file.pieceHashes.length).keys()) {
    pieceWorks.push({
      index: i,
      hash: torrent.file.pieceHashes[i],
      length: getPieceLength(i, torrent.file.pieceLength, torrent.file.length)
    })
  }

  torrent.peers.forEach(peer => {
    // create a TCP connection
    const conn = net.Socket()
    conn.setTimeout(1000 * 3, () => conn.destroy())
    conn.connect(peer.port, peer.ip, () => {
      console.log('Connected: ' + peer.ip + ':' + peer.port)
    })
    conn.on('error', () => {
      console.log('Could not connect to ' + peer.ip + ':' + peer.port)
    })
  })
}

module.exports = { download }
