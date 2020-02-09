const url = require('url')
const axios = require('axios')
const bencode = require('bencode')
const peer = require('./peer')
const urlencode = require('../util/urlencode')

const createQueryString = (params) => {
  const queryItems = []
  for (const [key, value] of Object.entries(params)) {
    queryItems.push(key + '=' + value)
  }
  return queryItems.join('&')
}

const buildTrackerURL = async (torrentFile, peerID, port) => {
  const announceURL = new url.URL(torrentFile.announce)

  let infoHashString = ''
  torrentFile.infoHash.forEach(num => {
    infoHashString += String.fromCharCode(num)
  })

  const params = {
    compact: '1',
    downloaded: '0',
    info_hash: await urlencode.encode(infoHashString),
    left: torrentFile.length,
    peer_id: peerID,
    port: port.toString(),
    uploaded: '0'
  }

  return announceURL.href + '?' + createQueryString(params)
}

const requestPeers = async (torrentFile, peerID, port) => {
  // const trackerURL = await buildTrackerURL(torrentFile, peerID, port)
  const trackerURL = 'https://torrent.ubuntu.com/announce?compact=1&downloaded=0&info_hash=%F8U%7F%FEOW%AA8%EB%15%80%10%ACz%7F%CDX%8A%85%A5&left=1158348800&peer_id=%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F%10%11%12%13%14&port=6881&uploaded=0'

  return axios.get(trackerURL, { responseType: 'arraybuffer' })
    .then(res => {
      const peersBuffer = bencode.decode(res.data).peers
      return peer.bytesToPeers(peersBuffer)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = { requestPeers }
