import { flags } from './parser.js'

// @TODO: Add format filter (snake case, camel case, etc.)
// @TODO: Add empty string/object/array filter

const noop = () => null

export default {
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
    const fn = data[name] ?? noop

    node.options.exec = v => fn(v, ...args)
  }
}
