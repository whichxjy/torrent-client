const emoji = require('node-emoji')
const work = require('./work')
const { HandshakeError } = require('./error')

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

  for (const peer of torrent.peers) {
    try {
      const worker = await new work.Worker(peer, torrent.file.infoHash, torrent.myPeerID)
      console.log(emoji.get('heavy_check_mark') + ' Completed handshake with ' + peer.ip + ':' + peer.port)

      await work.sendUnchoke(worker)
      await work.sendInterested(worker)

      for (let i = 0; i < pieceWorks.length; i++) {
        const pieceWork = pieceWorks.shift()
        if (!work.canDownload(worker, pieceWork)) {
          pieceWorks.push(pieceWork)
          console.log('no')
          continue
        }
        console.log('yes')
      }

      workers.push(worker)
    } catch (err) {
      if (err instanceof HandshakeError) {
        console.log(emoji.get('heavy_multiplication_x') + ' Could not handshake with ' + peer.ip + ':' + peer.port + ' [' + err.message + ']')
      } else {
        throw err
      }
    }
  }

  console.log(workers.length)
}

module.exports = { download }
