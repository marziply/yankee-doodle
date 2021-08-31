import { flags, tokens } from '../src/tokens.js'
import configure from '../src/configure.js'

describe('src/configure', () => {
  describe('configure', () => {
    it('should assign new options to flag and tokens', () => {
      expect(flags.MACRO).toEqual('!')
      expect(tokens.OPEN).toEqual(':{')

      configure({
        flags: {
          MACRO: '$'
        },
        tokens: {
          OPEN: ':('
        }
      })

      expect(flags.MACRO).toEqual('$')
      expect(tokens.OPEN).toEqual(':(')
    })
  })
})
