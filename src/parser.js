class Parser {
  constructor (schemas) {
    this.schemas = schemas
    this.tokens = this
      .strip()
      .split(this.reg.keys)
      .map(i => this.tokenise(i))
  }

  nodeify () {
    const [token, shift] = this.tokens.shift()
    const [key, ...raws] = token.split(Parser.tokens.DIV)
    const node = {
      children: [],
      filters: this.filterfy(raws),
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

  filterfy (raws) {
    return raws.map(r => {
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
    const com = (m, v, o) => m === '\n' && v[o + 1] !== Parser.tokens.CLOSE

    return this.schema
      .trim()
      .replace(/\s+/g, (...args) => com(...args) ? ',' : '')
  }

  parse () {
    while (this.tokens.length) {
      this.next(this.tree)
    }

    return this.tree
  }

  reg = {
    get keys () {
      return new RegExp(`,(?![^\(]*[$\)])|(?<=${Parser.tokens.OPEN})`)
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

module.exports = {
  Parser,
  tokens: Parser.tokens,
  flags: Parser.tokens.FLAGS
}
