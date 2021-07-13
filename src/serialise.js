const filters = require('./filters')

class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }

  yank (node, data, parent) {
    this.filter({
      ast: this.ast,
      node,
      data,
      parent
    })

    const value = this.get(data, node.key.path, node.options.nullable)
    const extract = node.options.extract.to
    const result = extract
      ? parent
      : parent[node.key.name]

    if (node.children.length) {
      if (!extract) {
        parent[node.key.name] = {}
      }

      for (const child of node.children) {
        this.yank(child, value, result)
      }

      return
    }

    parent[node.key.name] = value
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
