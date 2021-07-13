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

    const value = this.get(data, node.key.path, node.options)

    if (node.children.length) {
      this.dig(node, value, parent)
    } else {
      parent[node.key.name] = value
    }
  }

  dig (node, data, parent) {
    const extract = node.options.extract.to

    if (!data && !extract) {
      if (node.children.some(n => n.options.nullable)) {
        parent[node.key.name] = {}
      } else {
        parent[node.key.name] = null

        return
      }
    }

    for (const child of node.children) {
      this.yank(child, data, parent[node.key.name] ?? extract)
    }
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

  get (data, path, options) {
    const value = path.reduce((acc, curr) => acc?.[curr], data)
    const result = options.exec
      ? options.exec(value)
      : value

    return options.nullable
      ? result ?? null
      : result
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
