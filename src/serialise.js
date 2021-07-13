const filters = require('./filters')

class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }

  yank (node, data, result) {
    for (const { name, flag, args } of node.filters) {
      const filter = filters[name]

      filter({
        flag,
        args,
        node,
        data,
        result
      })
    }

    const value = this.get(data, node.key.path)
    const name = node.key.name()

    if (node.children.length) {
      result[name] = {}

      for (const child of node.children) {
        this.yank(child, value, result[name])
      }

      return
    }

    result[name] = value
  }

  get (data, path) {
    return path.reduce((acc, curr) => acc[curr], data)
  }

  serialise () {
    for (const node of this.ast) {
      this.yank(node, this.data, this.result)
    }

    return this.result
  }

  result = {}
}

function serialise (data, ast) {
  const serialiser = new Serialiser(data, ast)

  return serialiser.serialise()
}

module.exports = {
  Serialiser,
  serialise
}
