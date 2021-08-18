/**
 * Parses the given schemas into a somewhat simplified abstract syntax tree
 * (AST) which enables modules later on to decipher the properties to pick from
 * the given data object.
 *
 * @param {Array.<string>} schemas - Set of schemas to generate the AST from.
 */
export default class Parser {
  constructor (schemas) {
    this.schemas = schemas
    this.tokens = this
      .strip()
      .split(this.reg.keys)
      .map(i => this.tokenise(i))
  }

  /**
   * Generates a new node from the next item in the tokens queue.
   *
   * @returns {object} - Generated node.
   */
  nodeify () {
    const [token, shift] = this.tokens.shift()
    const [key, ...args] = token.split(Parser.tokens.DIV)
    const node = {
      children: [],
      filters: this.filterfy(args),
      options: {
        ...Parser.options
      },
      key: {
        value: key,
        path: key.split(Parser.tokens.SEG),
        name: key
          .split(Parser.tokens.SEG)
          .pop()
      }
    }

    return {
      shift,
      node
    }
  }

  /**
   * Generates a set of filters from the given property.
   *
   * @param {Array.<string>} args - Filter arguments.
   *
   * @returns {Array.<object>} - Property filter schemas.
   */
  filterfy (args) {
    return args.map(r => {
      const [key, params] = r.split(/(?=\([\w$_,]*\)|$)/g)
      const [name, flag] = key.split(this.reg.flags)
      const args = params
        ?.replace(/\(([\w$_,]*)\)/g, '$1')
        .split(',')
        .filter(Boolean)

      return {
        name,
        args: args ?? [],
        flag: {
          value: flag ?? null,
          on: (f, cb) => flag === f && cb()
        }
      }
    })
  }

  /**
   * Tokenises the given key into an array of key name and its respective
   * scope depth. Lengths more than 0 increase the depth of the scope, 0
   * changes nothing, and lengths less than 0 decrease the depth of the
   * scope.
   *
   * @param {string} key - Token item to determine the depth value.
   *
   * @returns {Array.<string|null, number>} - Defined depth per schema key.
   */
  tokenise (key) {
    const [prop, ...scopes] = key.split(this.reg.scopes)
    const length = this.measure(scopes)

    return prop === Parser.tokens.CLOSE
      ? [null, length - 1]
      : [prop, length]
  }

  next (children) {
    const { node, shift } = this.nodeify(children)
    const depth = this.depth

    this.depth += shift

    while (shift > 0 && this.depth > depth) {
      this.next(node.children)
    }

    if (node.key) children.push(node)
  }

  measure (scopes) {
    return +scopes.includes(Parser.tokens.OPEN) || -scopes.length || 0
  }

  strip () {
    const isNewLine = match => match === '\n'
    const isClose = (val, offset) => val[offset + 1] === Parser.tokens.CLOSE

    return this.schema
      .trim()
      .replace(/\s+/g, (m, v, o) => isNewLine(m) && !isClose(v, o) ? ',' : '')
  }

  parse () {
    while (this.tokens.length) {
      this.next(this.tree)
    }

    return this.tree
  }

  reg = {
    get keys () {
      return new RegExp(`,(?![^(]*[)])|(?<=${Parser.tokens.OPEN})`)
    },
    get scopes () {
      const { CLOSE, OPEN } = Parser.tokens

      return new RegExp(`(?=[${CLOSE}]+)|(?=${OPEN})`)
    },
    get flags () {
      const joined = Object
        .values(Parser.tokens.FLAGS)
        .map(i => `\\${i}`)
        .join('|')

      return new RegExp(`(?=${joined})`)
    }
  }

  depth = 0

  tree = []

  get schema () {
    return this.schemas.join(',')
  }

  static options = {
    nullable: false,
    extract: false,
    exec: null
  }

  static tokens = {
    OPEN: ':{',
    CLOSE: '}',
    DIV: '|',
    SEG: '.',
    FLAGS: {
      MACRO: '!'
    }
  }
}

export const tokens = Parser.tokens

export const flags = Parser.tokens.FLAGS
