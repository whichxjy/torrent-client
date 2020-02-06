const client = require('./torrent/client')
const tracker = require('./torrent/tracker')

const myPath = './archlinux-2019.12.01-x86_64.iso.torrent'

const peerIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

client.openTorrentFile(myPath).then(tf => {
  tracker.buildTrackerURL(tf, '123', 45644)
})
