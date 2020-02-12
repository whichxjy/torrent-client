const emoji = require('node-emoji')
const { Worker } = require('./worker')

class PieceWork {
  constructor (index, hash, length) {
    this.index = index
    this.hash = hash
    this.length = length
  }
}

// get length of the piece work
const getPieceLength = (index, pieceLength, length) => {
  const start = pieceLength * index
  const end = Math.min(start + pieceLength, length)
  return end - start
}

// download file according to the torrent object
const download = async (torrent) => {
  console.log('Start download ' + torrent.file.name)

  // works to do
  const pieceWorks = []

  for (let i = 0; i < torrent.file.pieceHashes.length; i++) {
    const hash = torrent.file.pieceHashes[i]
    const pieceLength = getPieceLength(i, torrent.file.pieceLength, torrent.file.length)
    pieceWorks.push(new PieceWork(i, hash, pieceLength))
  }

  const workers = []

  for (let i = 0; i < torrent.peers.length; i++) {
    const peer = torrent.peers[i]
    try {
      const worker = await new Worker(peer, torrent.file.infoHash, torrent.myPeerID)
      console.log(emoji.get('heavy_check_mark') + ' Completed handshake with ' + peer.ip + ':' + peer.port)
      workers.push(worker)
    } catch (err) {
      console.log(emoji.get('heavy_multiplication_x') + ' Could not handshake with ' + peer.ip + ':' + peer.port + ' [' + err.message + ']')
    }
  }

  console.log(workers.length)
}

module.exports = { download }
