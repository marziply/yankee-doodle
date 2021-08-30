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
