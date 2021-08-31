import { jest } from '@jest/globals'
import tokens from '../src/tokens.js'
import Parser from '../src/parser.js'

const schemas = [
  'firstName',
  `addressDetails: {
    address1
  }`,
]

describe('src/parser', () => {
  describe('constructor', () => {
    it('should set the schemas and tokens', () => {
      const { schema, tokens } = new Parser(schemas)

      expect(typeof schema).toEqual('string')
      expect(tokens).toEqual([
        ['firstName', 0],
        ['addressDetails', 1],
        ['address1', -1]
      ])
    })
  })

  describe('nodeify', () => {
    it('should shift tokens and return a node of that value', () => {
      const parser = new Parser(schemas)
      const node = parser.nodeify()

      expect(parser.tokens.length).toEqual(2)
      expect(node).toEqual({
        shift: 0,
        node: {
          ...node.node,
          key: {
            ...node.node.key,
            value: 'firstName',
            name: 'firstName'
          }
        }
      })
    })

    it('should return a node with key.path as a path to that value', () => {
      const parser = new Parser([
        'nested.data.items.one'
      ])
      const { node } = parser.nodeify()

      expect(node.key.path).toEqual([
        'nested',
        'data',
        'items',
        'one'
      ])
    })
  })

  describe('tokenise', () => {
    const tokenise = tok => {
      const parser = new Parser([])

      return parser.tokenise(tok)
    }
    const testResult = (tok, ex) => {
      const result = tokenise(`foo${tok}`)

      expect(result).toEqual(['foo', ex])
    }

    it('should return 1 in scope if the token is OPEN', () => {
      testResult(tokens.OPEN, 1)
    })

    it('should return -1 in scope if the token is CLOSE', () => {
      testResult(tokens.CLOSE, -1)
    })

    it('should return null in prop if the token has no children', () => {
      const result = tokenise(tokens.CLOSE)

      expect(result).toEqual([null, -1])
    })
  })

  describe('next', () => {
    const schemas = [
      `nested: {
        data: {
          items
        }
      }`
    ]

    it('should push all child nodes to a single parent node', () => {
      const parser = new Parser(schemas)
      const children = []

      parser.next(children)

      expect(children[0].children.length).toEqual(1)
      expect(children[0].children[0].children.length).toEqual(1)
    })

    it('should create a node via nodefiy()', () => {
      const parser = new Parser(schemas)
      const arg = 'test-arg'
      const node = {
        node: 'test-node',
        shift: 0
      }

      parser.nodeify = jest.fn().mockReturnValue(node)

      parser.next(arg)

      expect(parser.nodeify).toBeCalledWith(arg)
    })

    it.skip('should call itself if the node depth is lowered', () => {
      const parser = new Parser(schemas)
      const arg = 'test-arg'
      const children = 'test-children'
      const node = {
        node: 'test-node',
        shift: 1,
        children
      }
      const fn = parser.next.bind(parser)
      const mock = parser.next = jest.fn().mockReturnValue(arg)

      parser.nodeify = jest.fn().mockReturnValue(node)

      fn([])

      expect(mock).toBeCalledWith(children)
    })
  })

  describe('measure', () => {
    it('should measure the size of scope given', () => {
      const parser = new Parser([])

      expect(parser.measure(':{')).toEqual(1)
      expect(parser.measure('}')).toEqual(-1)
      expect(parser.measure('')).toEqual(0)
    })
  })

  describe('strip', () => {
    it('should strip out all whitespace from the schema', () => {
      const schemas = [
        `
          lots: {
            of: {
              whitespace
            }
          }
        `
      ]
      const parser = new Parser(schemas)
      const stripped = parser.strip()

      expect(stripped.match(/\s+/g)).toBeNull()
    })
  })

  describe('parse', () => {
    it('should run next() until tokens is empty and return tree', () => {
      const parser = new Parser(schemas)
      const tree = [
        {
          test: 'test-tree'
        }
      ]

      parser.tree = [...tree]
      parser.next = jest.fn().mockImplementation(() => parser.tokens.pop())

      const result = parser.parse()

      expect(parser.next).toBeCalledWith(tree)
      expect(result).toEqual(tree)
    })
  })
})
