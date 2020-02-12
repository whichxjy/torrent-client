const emoji = require('node-emoji')
const message = require('./message')
const work = require('./work')
const bitfield = require('./bitfield')
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
    this.backlog = 0
  }
}

// read message from the worker and update the state
const readMessage = async (pieceProgress) => {
  const currMessage = await work.receiveMessage(pieceProgress.worker)
  switch (currMessage.id) {
    case message.CHOKE: {
      pieceProgress.work.isChoking = true
      return
    }
    case message.UNCHOKE: {
      pieceProgress.work.isChoking = false
      return
    }
    case message.HAVE: {
      const index = message.parseHave(currMessage)
      bitfield.setPrice(pieceProgress.worker.bitfield, index)
      return
    }
    case message.PIECE: {
      const { index, begin, piece } = message.parsePiece(currMessage)
      if (index !== pieceProgress.index) {
        throw new Error('Wrong index')
      }
      if (begin >= piece.length) {
        throw new Error('Begin offset too high')
      }
      if (begin + piece.length > pieceProgress.buffer.length) {
        throw new Error('Piece too long')
      }
      // write the downloaded piece to the buffer of piece progress
      pieceProgress.buffer.write(piece, begin, piece.length)
      pieceProgress.downloaded += piece.length
      pieceProgress.backlog -= 1
    }
  }
}

// attempt to download the given piece
const attemptToDownload = async (worker, pieceWork) => {
  // work.socket.setTimeout(30000)

  const pieceProgress = new PieceProgress(worker, pieceWork.index, Buffer.alloc(pieceWork.length))

  while (pieceProgress.downloaded < pieceWork.length) {
    // no data will be sent until unchoking happens
    if (pieceProgress.worker.isChoking) {

    }
    // read message and update
    await readMessage(pieceProgress)
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
