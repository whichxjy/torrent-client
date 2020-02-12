const assert = require('assert').strict
const { describe, it } = require('mocha')
const bitfield = require('../lib/core/bitfield')

describe('bitfield', () => {
  describe('#hasPiece()', () => {
    const tests = [
      {
        result: bitfield.hasPiece(Buffer.from([]), 123),
        expect: false
      },
      {
        result: bitfield.hasPiece(Buffer.from([0b01010101]), 123),
        expect: false
      },
      {
        result: (() => {
          const bf = Buffer.from([0b01010101])
          const output = []
          for (let i = 0; i < 8 * bf.length; i++) {
            output.push(bitfield.hasPiece(bf, i))
          }
          return output
        })(),
        expect: [false, true, false, true, false, true, false, true]
      },
      {
        result: (() => {
          const bf = Buffer.from([0b01011101, 0b11101001])
          const output = []
          for (let i = 0; i < 8 * bf.length; i++) {
            output.push(bitfield.hasPiece(bf, i))
          }
          return output
        })(),
        expect: [false, true, false, true, true, true, false, true, true, true, true, false, true, false, false, true]
      }
    ]

    tests.forEach((test, i) => {
      it('test ' + (i + 1), () => {
        assert.deepEqual(test.result, test.expect)
      })
    })
  })
})
