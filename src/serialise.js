const filters = require('./filters')

class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }

  yank (node, data, result) {
    this.filter({
      node,
      data,
      result
    })

    const value = this.get(data, node.key.path, node.options.nullable)

    if (node.children.length) {
      result[node.key.name] = {}

      for (const child of node.children) {
        this.yank(child, value, result[node.key.name])
      }

      return
    }

    result[node.key.name] = value
  }

  filter (params) {
    for (const { name, flag, args } of params.node.filters) {
      const filter = filters[name]

      filter({
        ...params,
        flag,
        args
      })
    }
  }

  get (data, path, nullable) {
    const value = path.reduce((acc, curr) => acc[curr], data)

    return nullable
      ? value ?? null
      : value
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
