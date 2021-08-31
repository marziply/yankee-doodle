import { jest } from '@jest/globals'
import Flag from '../src/flag.js'

describe('src/flag', () => {
  describe('constructor', () => {
    it('should set flag', () => {
      const value = 'test-flag'
      const flag = new Flag(value)

      expect(flag.flag).toEqual(value)
    })
  })

  describe('on', () => {
    it('should run callback if flag is equal to argument', () => {
      const value = 'test-flag'
      const flag = new Flag(value)
      const callback = jest.fn()

      flag.on(value, callback)

      expect(callback).toBeCalled()
    })

    it('should not run callback if flag is not equal to argument', () => {
      const value = 'test-flag'
      const flag = new Flag(value)
      const callback = jest.fn()

      flag.on('test-value', callback)

      expect(callback).not.toBeCalled()
    })
  })
})
