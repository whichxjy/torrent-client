const fs = require('fs')
const bencode = require('bencode')
const hash = require('../utils/hash')

// read torrent file data form the torrent file
const readTorrentFileData = async (torrentfilePath) => {
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

// get checksum of the torrent file info form the torrent file data
const getInfoHash = (torrentFileData) => {
  const info = torrentFileData.info
  return hash.getSha1(bencode.encode(info))
}

// get hashes form the torrent file data
const getHashes = (torrentFileData) => {
  const hashLen = 20
  const pieces = torrentFileData.info.pieces

  if (pieces.length % hashLen !== 0) {
    throw new Error('The length of pieces is wrong.')
  }

  const hashes = []
  const hashesNum = pieces.length / hashLen

  for (const i of Array(hashesNum).keys()) {
    hashes.push(pieces.slice(i * hashLen, (i + 1) * hashLen))
  }

  return hashes
}

// get torrent file from the torrent file data
const getTorrentFile = (torrentFileData) => {
  const announce = torrentFileData.announce.toString()
  const infoHash = getInfoHash(torrentFileData).toString()
  const length = torrentFileData.info.length
  const name = torrentFileData.info.name
  const pieceHashes = getHashes(torrentFileData)
  const pieceLength = torrentFileData.info['piece length']
  // return torrent file object
  return {
    announce: announce,
    infoHash: infoHash,
    length: length,
    name: name,
    pieceHashes: pieceHashes,
    pieceLength: pieceLength
  }
}

// open torrent file
const openTorrentFile = async (torrentfilePath) => {
  const torrentFileData = await readTorrentFileData(torrentfilePath)
  return getTorrentFile(torrentFileData)
}

module.exports = { openTorrentFile }
