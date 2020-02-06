const fs = require('fs')
const bencode = require('bencode')

const myPath = '../archlinux-2019.12.01-x86_64.iso.torrent'

// read json form torrent file
const readTorrentJson = async (torrentfilePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(torrentfilePath, (err, data) => {
      if (!err) {
        resolve(bencode.decode(data))
      } else {
        reject(err)
      }
    })
  })
}

// get hashes form torrent json
const getHashes = (torrentJson) => {
  const hashLen = 20
  const pieces = torrentJson.info.pieces

  if (pieces.length % hashLen !== 0) {
    throw new Error('The length of pieces is wrong.')
  }

  const hashes = []
  const hashesNum = pieces.length / 20

  for (const i of Array(hashesNum).keys()) {
    hashes.push(pieces.slice(i * hashLen, (i + 1) * hashLen))
  }

  return hashes
}

readTorrentJson(myPath).then(torrentJson => {
  console.log(getHashes(torrentJson))
})
