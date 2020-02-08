const crypto = require('crypto')

const getSha1 = (bytes) => {
  return crypto.createHash('sha1').update(bytes, 'binary').digest()
}

module.exports = { getSha1 }
