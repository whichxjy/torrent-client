const client = require('./torrent/client')
const tracker = require('./torrent/tracker')

const myPath = './lubuntu-18.04.3-desktop-amd64.iso.torrent'

client.openTorrentFile(myPath).then(async (tf) => {
  await tracker.requestPeers(tf, '123', 45644)
})
