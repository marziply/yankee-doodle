class Parser {
  constructor (schema) {
    this.tokens = this
      .strip(schema)
      .split(/,|(?<=:{)/g)
      .map(i => this.tokenise(i))

    while (this.tokens.length) {
      this.next(this.tree)
    }
  }

  nodeify () {
    const [token, shift] = this.tokens.shift()
    const [key, ...filters] = token.split('|')
    const node = {
      filters: this.filterfy(filters),
      children: [],
      key
    }

    return {
      shift,
      node
    }
  }

  tokenise (key) {
    const [prop, ...scopes] = key.split(/(?=[}]+)|(?=:{)/g)
    const length = +scopes.includes(':{') || -scopes.length || 0

    return prop === '}'
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

  strip (schema) {
    return schema
      .trim()
      .replace(/\s+/g, (match, offset, value) => {
        return match === '\n' && value[offset + 1] !== '}'
          ? ','
          : ''
      })
  }

  parse () {
    return this.tree
  }

  depth = 0

  tree = []
}

function parse (schema) {
  const parser = new Parser(schema)

  return parser.parse()
}

const schema = `
  id,
  name | as(title),
  programme.banner_video | nullable! | extract: {
    id | as(banner_video_id),
    handle | as(banner_video_handle)
  },
  space: {
    name,
    handle
  },
  sgid | exec($identity)
`

console.log(JSON.stringify(parse(schema)))

module.exports = {
  Parser,
  parse
}
