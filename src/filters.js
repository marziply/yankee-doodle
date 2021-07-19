const { flags } = require('./parser')

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
  extract ({ node }) {
    node.options.extract = true
  },
  exec ({ node, data, args: [name, ...args] }) {
    const fn = data[name] ?? (() => null)

    node.options.exec = v => fn(v, ...args)
  }
}
