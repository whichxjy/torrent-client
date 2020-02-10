const assert = require('assert').strict
const { describe, it } = require('mocha')
const message = require('../lib/core/message')

describe('message', () => {
  describe('#serialize()', () => {
    const tests = [
      {
        result: message.serialize({
          id: message.CHOKE
        }),
        expect: Buffer.from(new Uint8Array([0, 0, 0, 1, 0]))
      },
      {
        result: message.serialize({
          id: message.CHOKE,
          payload: new Uint8Array([])
        }),
        expect: Buffer.from(new Uint8Array([0, 0, 0, 1, 0]))
      },
      {
        result: message.serialize({
          id: message.HAVE,
          payload: new Uint8Array([1, 2, 3, 4, 5])
        }),
        expect: Buffer.from(new Uint8Array([0, 0, 0, 6, 4, 1, 2, 3, 4, 5]))
      }
    ]

    tests.forEach((test, i) => {
      it('test ' + (i + 1), () => {
        assert.deepEqual(test.result, test.expect)
      })
    })
  })
})
