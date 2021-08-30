import { jest } from '@jest/globals'
import Serialiser from '../src/serialiser.js'
import original from './data.json'

const data = () => ({
  ...original
})
const node = () => ({
  children: [],
  filters: [],
  options: {},
  key: {
    name: 'one',
    path: [
      'nested',
      'data',
      'items',
      'one'
    ]
  }
})
const ast = () => [
  node()
]

describe('src/serialiser', () => {
  describe('constructor', () => {
    it('should set data and ast', () => {
      const data = 'test-data'
      const ast = 'test-ast'
      const serialiser = new Serialiser(data, ast)

      expect(serialiser.data).toEqual(data)
      expect(serialiser.ast).toEqual(ast)
    })
  })

  describe.skip('yank', () => {
    it('should apply filters by running filter method', () => {
      const serialiser = new Serialiser(data(), ast())
      const value = data()
      const parent = 'test-parent'
      const curr = {
        ...node()
      }

      serialiser.filter = jest
        .fn()
        .mockReturnValue(curr)

      serialiser.yank(curr, value, parent)

      expect(serialiser.filter).toBeCalledWith({
        data: value,
        node: curr,
        parent: {}
      })
    })

    it('should descend through all children', () => {
      const serialiser = new Serialiser(data(), ast())

      serialiser.filter = jest.fn()

      serialiser.yank()
    })
  })

  describe('dig', () => {

  })

  describe('filter', () => {

  })

  describe('serialise', () => {

  })

  describe('get', () => {

  })

  describe('set', () => {

  })
})
