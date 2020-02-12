const emoji = require('node-emoji')
const work = require('./work')
const { hasPiece } = require('./bitfield')
const { HandshakeError } = require('./error')

class PieceWork {
  constructor (index, hash, length) {
    this.index = index
    this.hash = hash
    this.length = length
  }
}

class PieceProgress {
  constructor (worker, index, buffer) {
    this.worker = worker
    this.index = index
    this.buffer = buffer
    this.downloaded = 0
    this.requested = 0
  }
}

// get length of the piece work
const getPieceLength = (index, pieceLength, length) => {
  const start = pieceLength * index
  const end = Math.min(start + pieceLength, length)
  return end - start
}

// check if the worker can download the given piece work
const canDownload = (worker, pieceWork) => hasPiece(worker.bitfield, pieceWork.index)

// attempt to download the work piece
const attemptToDownload = async (worker, pieceWork) => {
  work.socket.setTimeout(30000)

  const state = new PieceProgress(worker, pieceWork.index, Buffer.from([]))

  while (state.downloaded < pieceWork.length) {
    // no data will be sent until unchoking happens
    if (!state.worker.isChoking) {

    }
  }
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
        if (!canDownload(worker, pieceWork)) {
          pieceWorks.push(pieceWork)
          console.log('no')
          continue
        }
        await attemptToDownload(worker, pieceWork)
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
