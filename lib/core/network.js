const { Worker } = require('./worker')

const getPieceLength = (index, pieceLength, length) => {
  const start = pieceLength * index
  const end = Math.min(start + pieceLength, length)
  return end - start
}

// download file according to the torrent object
const download = async (torrent) => {
  console.log('Start download: ' + torrent.file.name)

  // works to do
  const pieceWorks = []

  for (const i of Array(torrent.file.pieceHashes.length).keys()) {
    pieceWorks.push({
      index: i,
      hash: torrent.file.pieceHashes[i],
      length: getPieceLength(i, torrent.file.pieceLength, torrent.file.length)
    })
  }

  const workers = []

  for (const i of Array(torrent.peers.length).keys()) {
    const peer = torrent.peers[i]
    try {
      const worker = await new Worker(peer)
      console.log('Connected: ' + peer.ip + ':' + peer.port)
      workers.push(worker)
    } catch (_) {
      console.log('Could not connect to ' + peer.ip + ':' + peer.port)
    }
  }

  console.log(workers.length)
}

module.exports = { download }
