const url = require('url')
const axios = require('axios')
const bencode = require('bencode')
const peer = require('./peer')
const urlencode = require('../util/urlencode')

// create query string for the url
const createQueryString = (params) => {
  const queryItems = []
  for (const [key, value] of Object.entries(params)) {
    queryItems.push(key + '=' + value)
  }
  return queryItems.join('&')
}

// build url for the tracker
const buildTrackerURL = async (torrentFile, port) => {
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
    peer_id: peer.MY_PEER_ID_ENCODED,
    port: port.toString(),
    uploaded: '0'
  }

  return announceURL.href + '?' + createQueryString(params)
}

// request peers according to the torrent file and the port
const requestPeers = async (torrentFile, port) => {
  // const trackerURL = await buildTrackerURL(torrentFile, port)
  const trackerURL = 'https://torrent.ubuntu.com/announce?compact=1&downloaded=0&info_hash=W%C9%AE%22kG%99W%1F%91%E7%B4V%87%25%F2%89%07%89%C0&left=1179549696&peer_id=%D1%E7%AF%D2%06%CF%DD%18%CA%B6%8F%193%B9%C0%40%98%E8%C3%F4&port=6881&uploaded=0'

  return axios.get(trackerURL, { responseType: 'arraybuffer' })
    .then(res => {
      const data = bencode.decode(res.data)
      if (data.peers === undefined) {
        throw new Error(data['failure reason'].toString())
      } else {
        const peersBuffer = bencode.decode(res.data).peers
        return peer.bytesToPeers(peersBuffer)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = { requestPeers }
