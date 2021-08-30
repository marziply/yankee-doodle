import tokens from './tokens.js'
import Filter from './filter.js'
import Property from './property.js'

export default class Node {
  constructor (token, shift) {
    const [name, ...args] = token.split(tokens.DIV)

    this.token = token
    this.shift = shift
    this.name = name
    this.args = args
    this.key = new Property(name)
    this.filters = args.map(arg => new Filter(arg))
  }

  /**
   * Applies filters defined in the AST schema with parameters set within the
   * schema.
   *
   * @param {object} data - Data to extract properties from.
   *
   * @returns {Node} - Node with filters applied.
   */
  filter (data) {
    for (const filter of this.filters) {
      filter.apply(this, data)
    }

    return this
  }

  self = () => this

  children = []

  options = {
    ...Node.options
  }

  static options = {
    nullable: false,
    extract: false,
    exec: null
  }
}
