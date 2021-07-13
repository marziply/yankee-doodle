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
  extract () {

  },
  exec () {

  }
}
