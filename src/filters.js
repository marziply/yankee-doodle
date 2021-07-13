const { flags } = require('./parse')

module.exports = {
  as ({ node, args: [name] }) {
    node.key.name = name
  },
  nullable ({ node, flag }) {
    node.options.nullable = true

    flag.on(flags.MACRO, () => {
      for (const { options } of node.children) {
        options.nullable = true
      }
    })
  },
  extract ({ node, parent }) {
    node.options.extract.to = parent
  },
  exec ({ node, data, args: [name, ...args] }) {
    const fn = data[name] ?? (() => null)

    node.options.exec = v => fn(v, ...args)
  }
}
