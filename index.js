const client = require('./torrent/client')

const myPath = './archlinux-2019.12.01-x86_64.iso.torrent'

client.openTorrentFile(myPath).then(tf => {
  console.log(tf)
})
