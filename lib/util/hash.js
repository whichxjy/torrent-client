const crypto = require('crypto')

const getSha1 = (bytes) => crypto.createHash('sha1').update(bytes, 'binary').digest()

module.exports = { getSha1 }
