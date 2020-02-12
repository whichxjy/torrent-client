class HandshakeError extends Error {
  constructor (message) {
    super(message)
    this.name = 'HandshakeError'
  }
}

class ParseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ParseError'
  }
}

module.exports = { HandshakeError, ParseError }
