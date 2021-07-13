class Parser {
  constructor (schema) {
    this.tokens = this
      .strip(schema)
      .split(this.reg.keys)
      .map(i => this.tokenise(i))

    while (this.tokens.length) {
      this.next(this.tree)
    }
  }

  nodeify () {
    const [token, shift] = this.tokens.shift()
    const [key, ...raws] = token.split(Parser.tokens.DIV)
    const node = {
      filters: this.filterfy(raws),
      children: [],
      key: {
        value: key,
        path: key.split(Parser.tokens.SEG),
        name () {
          return this.value
            .split(Parser.tokens.SEG)
            .pop()
        }
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
        args: args ?? [],
        flag: flag ?? null,
        name
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

  next (parent) {
    const { node, shift } = this.nodeify()
    const depth = this.depth

    this.depth += shift

    while (shift > 0 && this.depth > depth) {
      this.next(node.children)
    }

    if (node.key) parent.push(node)
  }

  measure (scopes) {
    return +scopes.includes(Parser.tokens.OPEN) || -scopes.length || 0
  }

  strip (schema) {
    const com = (m, v, o) => m === '\n' && v[o + 1] !== Parser.tokens.CLOSE

    return schema
      .trim()
      .replace(/\s+/g, (...args) => com(...args) ? ',' : '')
  }

  parse () {
    return this.tree
  }

  reg = {
    get keys () {
      return new RegExp(`,|(?<=${Parser.tokens.OPEN})`)
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

function parse (schema) {
  const parser = new Parser(schema)

  return parser.parse()
}

module.exports = {
  Parser,
  parse,
  tokens: Parser.tokens
}
