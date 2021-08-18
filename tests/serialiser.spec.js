import Serialiser from '../src/serialiser.js'
import data from './data.json'

const node = {
  children: [],
  filters: [],
  options: {},
  key: {}
}
const ast = []

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

  describe('yank', () => {
    it('should apply filters', () => {
      const serialiser = new Serialiser(data, ast)
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
