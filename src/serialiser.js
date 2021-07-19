const filters = require('./filters')

const { assign } = Object

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
    const set = this.set.bind(this, node, parent)

    if (node.children.length) {
      if (value || node.options.nullable) {
        const children = this.dig(node, value)

        if (node.options.extract) {
          assign(parent, children)
        } else {
          set(children)
        }
      }
    } else {
      set(value)
    }
  }

  dig (node, data) {
    const result = {}
    const nullable = node.children.every(n => !n.options.nullable)

    if (!data && nullable) return null

    for (const child of node.children) {
      this.yank(child, data, result)
    }

    return result
  }

  filter (params) {
    for (const { name, flag, args } of params.node.filters) {
      const filter = filters[name]
      const merged = assign(params, {
        flag,
        args
      })

      filter(merged)
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

  set (node, parent, value) {
    parent[node.key.name] = value
  }

  serialise () {
    for (const node of this.ast) {
      this.yank(node, this.data, this.result)
    }

    return this.result
  }

  result = {}
}

module.exports = {
  Serialiser
}
