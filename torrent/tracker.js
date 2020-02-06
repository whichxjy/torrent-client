const url = require('url')

const buildTrackerURL = (torrentFile, peerID, port) => {
  const announceURL = new url.URL(torrentFile.announce)
  const params = {
    info_hash: torrentFile.infoHash,
    peer_id: peerID,
    port: port.toString(),
    uploaded: '0',
    downloaded: '0',
    compact: '1',
    left: torrentFile.length.toString()
  }
  Object.entries(params).forEach(([key, value]) => {
    announceURL.searchParams.append(key, value)
  })
  return announceURL.href
}

module.exports = { buildTrackerURL }
