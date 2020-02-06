const torrentfile = require('./torrent/torrentfile')

const myPath = './archlinux-2019.12.01-x86_64.iso.torrent'

torrentfile.openTorrentFile(myPath).then(tf => {
  console.log(tf)
})
