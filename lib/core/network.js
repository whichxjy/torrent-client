const { PromiseSocket } = require('promise-socket')

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

  const sockets = []

  for (const i of Array(torrent.peers.length).keys()) {
    const peer = torrent.peers[i]
    try {
      const socket = new PromiseSocket()
      socket.setTimeout(2000)
      await socket.connect(peer.port, peer.ip)
      console.error('Connected: ' + peer.ip + ':' + peer.port)
      sockets.push(socket)
    } catch (_) {
      console.error('Could not connect to ' + peer.ip + ':' + peer.port)
    }
  }

  console.log(sockets.length)
}

module.exports = { download }
