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

  console.log(pieceWorks)
}

module.exports = { download }
