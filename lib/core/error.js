class HandshakeError extends Error {
  constructor (message) {
    super(message)
    this.name = 'HandshakeError'
  }
}

module.exports = { HandshakeError }
