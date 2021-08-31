import { tokens, reg } from './tokens.js'
import Node from './node.js'

/**
 * Parses the given schemas into a somewhat simplified abstract syntax tree
 * (AST) which enables modules later on to decipher the properties to pick from
 * the given data object.
 *
 * @param {Array.<string>} schemas - Set of schemas to generate the AST from.
 */
export default class Parser {
  constructor (schemas) {
    this.schema = schemas.join(',')
    this.tokens = this
      .strip()
      .split(reg.keys)
      .map(i => this.tokenise(i))
  }

  /**
   * Generates a new node from the next item in the tokens queue.
   *
   * @returns {object} - Generated node.
   */
  nodeify () {
    const [token, shift] = this.tokens.shift()
    const node = new Node(token, shift)

    return {
      shift,
      node
    }
  }

  /**
   * Tokenises the given key into an array of key name and its respective
   * scope depth. Lengths more than 0 increase the depth of the scope, 0
   * changes nothing, and lengths less than 0 decrease the depth of the
   * scope.
   *
   * @param {string} key - Token item to determine the depth value.
   *
   * @returns {Array.<string | null, number>} - Defined depth per schema key.
   */
  tokenise (key) {
    const [prop, ...scopes] = key.split(reg.scopes)
    const length = this.measure(scopes)

    return prop === tokens.CLOSE
      ? [null, length - 1]
      : [prop, length]
  }

  /**
   * Retrieves the next top-level token in the tokens array and then descends
   * into all of it's children tokens.
   *
   * @param {Array.<Node>} parent - Parent node array to push children to.
   *
   * @returns {void}
   */
  next (parent) {
    const { node, shift } = this.nodeify(parent)
    const depth = this.depth

    this.depth += shift

    while (shift > 0 && this.depth > depth) {
      this.next(node.children)
    }

    if (node.key) parent.push(node)
  }

  /**
   * Measures the length of the given scope from a series of tokens.
   *
   * @param {Array.<string>} chars - Token strings to measure scope from.
   *
   * @returns {number} - Scope size.
   */
  measure (chars) {
    return +chars.includes(tokens.OPEN) || -chars.length || 0
  }

  /**
   * Strips all whitespace from the schema while also joining newlines between
   * properties with a comma.
   *
   * @returns {string} - Stripped schema.
   */
  strip () {
    const isNewLine = match => match === '\n'
    const isClose = (val, offset) => val[offset + 1] === tokens.CLOSE

    return this.schema
      .trim()
      .replace(/\s+/g, (m, v, o) => isNewLine(m) && !isClose(v, o) ? ',' : '')
  }

  /**
   * Parses all tokens in the schema into a really simple abstract syntax tree
   * for the serialiser to iterate through.
   *
   * @returns {Array.<Node>} - Abstract syntax tree of token nodes.
   */
  parse () {
    while (this.tokens.length) {
      this.next(this.tree)
    }

    return this.tree
  }

  depth = 0

  tree = []
}
