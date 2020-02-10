const client = require('./lib/core/client')

const myPath = './lubuntu-18.04.3-desktop-amd64.iso.torrent'

const hello = async () => {
  await client.openTorrentFile(myPath).then(client.downloadToFile, 'target_path')
}

hello()
