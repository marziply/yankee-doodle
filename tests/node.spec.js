import { jest } from '@jest/globals'
import Filter from '../src/filter.js'
import Property from '../src/property.js'
import Node from '../src/node.js'

describe('src/node', () => {
  describe('constructor', () => {
    it('should set token, shift, name, args, key, and filters', () => {
      const token = 'dateOfBirth|as(dob)'
      const shift = 0
      const node = new Node(token, shift)

      expect(node.token).toEqual(token)
      expect(node.shift).toEqual(shift)
      expect(node.name).toEqual('dateOfBirth')
      expect(node.args).toEqual(['as(dob)'])
      expect(node.key).toBeInstanceOf(Property)
      expect(node.filters.every(f => f instanceof Filter)).toBe(true)
    })
  })

  describe('filter', () => {
    it('should apply all filters', () => {
      const node = new Node('foo', 0)
      const data = 'test-data'
      const fn = jest.fn()

      node.filters = [
        {
          apply: fn
        },
        {
          apply: fn
        }
      ]

      node.filter(data)

      expect(fn).toBeCalledTimes(node.filters.length)
      expect(fn).toBeCalledWith(node, data)
    })
  })
})
