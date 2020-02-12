const assert = require('assert').strict
const { describe, it } = require('mocha')
const message = require('../lib/core/message')

describe('message', () => {
  describe('#serialize()', () => {
    const tests = [
      {
        result: message.serialize(new message.Message(message.CHOKE)),
        expect: Buffer.from([0, 0, 0, 1, 0])
      },
      {
        result: message.serialize(new message.Message(message.CHOKE, Buffer.from([]))),
        expect: Buffer.from([0, 0, 0, 1, 0])
      },
      {
        result: message.serialize(new message.Message(message.HAVE, Buffer.from([1, 2, 3, 4, 5]))),
        expect: Buffer.from([0, 0, 0, 6, 4, 1, 2, 3, 4, 5])
      }
    ]

    tests.forEach((test, i) => {
      it('test ' + (i + 1), () => {
        assert.deepEqual(test.result, test.expect)
      })
    })
  })

  describe('#createHave()', () => {
    const tests = [
      {
        result: message.createHave(1),
        expect: new message.Message(message.HAVE, Buffer.from([
          0x00, 0x00, 0x00, 0x01
        ]))
      },
      {
        result: message.createHave(123),
        expect: new message.Message(message.HAVE, Buffer.from([
          0x00, 0x00, 0x00, 0x7B
        ]))
      },
      {
        result: message.createHave(123456789),
        expect: new message.Message(message.HAVE, Buffer.from([
          0x07, 0x5B, 0xCD, 0x15
        ]))
      }
    ]

    tests.forEach((test, i) => {
      it('test ' + (i + 1), () => {
        assert.deepEqual(test.result, test.expect)
      })
    })
  })

  describe('#createRequest()', () => {
    const tests = [
      {
        result: message.createRequest(1, 2, 3),
        expect: new message.Message(message.REQUEST, Buffer.from([
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x02,
          0x00, 0x00, 0x00, 0x03
        ]))
      },
      {
        result: message.createRequest(123, 456, 789),
        expect: new message.Message(message.REQUEST, Buffer.from([
          0x00, 0x00, 0x00, 0x7B,
          0x00, 0x00, 0x01, 0xC8,
          0x00, 0x00, 0x03, 0x15
        ]))
      },
      {
        result: message.createRequest(1111, 2222, 3333),
        expect: new message.Message(message.REQUEST, Buffer.from([
          0x00, 0x00, 0x04, 0x57,
          0x00, 0x00, 0x08, 0xAE,
          0x00, 0x00, 0x0D, 0x05
        ]))
      }
    ]

    tests.forEach((test, i) => {
      it('test ' + (i + 1), () => {
        assert.deepEqual(test.result, test.expect)
      })
    })
  })
})
