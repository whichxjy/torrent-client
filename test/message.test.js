const assert = require('assert').strict
const { describe, it } = require('mocha')
const message = require('../lib/core/message')

describe('message', () => {
  describe('#serializeMessage()', () => {
    it('test 1', function () {
      const result = message.serializeMessage({
        id: message.msgChoke,
        payload: new Uint8Array([])
      })
      const expect = Buffer.from(new Uint8Array([0, 0, 0, 1, 0]))
      assert.deepEqual(result, expect)
    })

    it('test 2', function () {
      const result = message.serializeMessage({
        id: message.msgHave,
        payload: new Uint8Array([1, 2, 3, 4, 5])
      })
      const expect = Buffer.from(new Uint8Array([0, 0, 0, 6, 4, 1, 2, 3, 4, 5]))
      assert.deepEqual(result, expect)
    })
  })
})
