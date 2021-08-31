import { jest } from '@jest/globals'
import Serialiser from '../src/serialiser.js'
import original from './data.json'

const data = () => ({
  ...original
})
const node = () => ({
  filter: jest.fn(),
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

  describe('yank', () => {
    const setup = ({ options = {}, children = [] } = {}) => {
      const serialiser = new Serialiser(data(), ast())
      const value = 'test-value'
      const set = 'test-set'
      const child = {
        value: true
      }
      const root = {
        options,
        children,
        filter () {
          return this
        },
        key: {
          path: []
        }
      }

      serialiser.get = jest
        .fn()
        .mockReturnValue(value)
      serialiser.set = jest
        .fn()
        .mockReturnValue(set)
      serialiser.dig = jest
        .fn()
        .mockReturnValue(child)

      return {
        serialiser,
        value,
        child,
        root
      }
    }

    it('should assign to parent if extract is truthy', () => {
      const { serialiser, root } = setup({
        options: {
          extract: true
        },
        children: [
          'test-child'
        ]
      })
      const parent = {}

      serialiser.yank(root, data, parent)

      expect(parent.value).toEqual(true)
      expect(serialiser.set).not.toBeCalled()
    })

    it('should set all children to the parent', () => {
      const { serialiser, root, child } = setup({
        children: [
          'test-child'
        ]
      })
      const parent = {}

      serialiser.yank(root, data, parent)

      const { length } = Object.keys(parent)

      expect(serialiser.set).toBeCalledWith(parent, root.key, child)
      expect(length).toEqual(0)
    })

    it('should set value on the parent', () => {
      const { serialiser, root, value } = setup()
      const parent = {}

      serialiser.yank(root, data, parent)

      expect(serialiser.set).toBeCalledWith(parent, root.key, value)
    })
  })

  describe('dig', () => {
    it('should return null if data is falsey and is nullable', () => {
      const serialiser = new Serialiser(data(), ast())
      const result = serialiser.dig(undefined, [])

      expect(result).toBeNull()
    })

    it('should return result', () => {
      const serialiser = new Serialiser(data(), ast())
      const value = 'test-value'

      serialiser.yank = jest.fn()

      const result = serialiser.dig(value, [])

      expect(result).toEqual({})
    })

    it('should call yank for each child', () => {
      const serialiser = new Serialiser(data(), ast())
      const value = 'test-value'
      const children = [
        {
          options: {}
        },
        {
          options: {}
        }
      ]

      serialiser.yank = jest.fn()
      serialiser.dig(value, children)

      expect(serialiser.yank).toBeCalledTimes(children.length)
      expect(serialiser.yank).toBeCalledWith(children[0], value, {})
    })
  })

  describe('serialise', () => {
    it('should call yank for each item in the AST', () => {
      const value = 'test-value'
      const ast = [
        'test-1',
        'test-2'
      ]
      const data = {
        value
      }
      const serialiser = new Serialiser(data, ast)

      serialiser.yank = jest.fn()
      serialiser.serialise()

      expect(serialiser.yank).toBeCalledTimes(ast.length)
    })

    it('should return result', () => {
      const serialiser = new Serialiser(data(), ast())
      const value = 'test-result'

      serialiser.result = value
      serialiser.yank = jest.fn()

      const result = serialiser.serialise()

      expect(result).toEqual(value)
    })
  })

  describe('get', () => {
    const path = [
      'nested',
      'data',
      'items',
      'one'
    ]

    it('should retrieve a value from a given path', () => {
      const source = data()
      const serialiser = new Serialiser(source, ast())
      const result = serialiser.get(source, path)

      expect(result).toEqual('one')
    })

    it('should run exec() if available in options', () => {
      const source = data()
      const serialiser = new Serialiser(source, ast())
      const value = 'test-value'
      const options = {
        exec: jest
          .fn()
          .mockReturnValue(value)
      }
      const result = serialiser.get(source, path, options)

      expect(result).toEqual(value)
    })

    it('should return null if options.nullable is truthy and result is not', () => {
      const source = data()
      const serialiser = new Serialiser(source, ast())
      const path = [
        'foo',
        'bar'
      ]
      const options = {
        nullable: true
      }
      const result = serialiser.get(source, path, options)

      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should set the value at the given key location', () => {
      const serialiser = new Serialiser(data(), ast())
      const parent = {}
      const key = {
        name: 'foo'
      }
      const value = 'test-value'

      serialiser.set(parent, key, value)

      expect(parent.foo).toEqual(value)
    })
  })
})
