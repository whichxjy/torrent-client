const url = require('url')
const querystring = require('querystring')
const axios = require('axios')
const bencode = require('bencode')
const peer = require('./peer')

const buildTrackerURL = (torrentFile, peerID, port) => {
  const announceURL = new url.URL(torrentFile.announce)

  const params = {
    info_hash: torrentFile.infoHash,
    peer_id: peerID,
    port: port.toString(),
    uploaded: '0',
    downloaded: '0',
    compact: '1',
    left: torrentFile.length
  }

  return announceURL.href + '?' + querystring.stringify(params)
}

const requestPeers = async (torrentFile, peerID, port) => {
  const trackerURL = buildTrackerURL(torrentFile, peerID, port)
  const goURL = 'https://torrent.ubuntu.com/announce?compact=1&downloaded=0&info_hash=%F8U%7F%FEOW%AA8%EB%15%80%10%ACz%7F%CDX%8A%85%A5&left=1158348800&peer_id=NH%5D%BDp%60%17%0D%04%0Bt%06%C0r%C7%9B%CCQL%F8&port=6881&uploaded=0'

  return axios.get(goURL, {
    responseType: 'arraybuffer'
  })
    .then(res => {
      const peersBuffer = bencode.decode(res.data).peers
      return peer.bytesToPeers(peersBuffer)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = { requestPeers }
