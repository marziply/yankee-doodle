import { FilterNotFoundError } from './validator.js'
import { reg, flags } from './tokens.js'
import Flag from './flag.js'

// @TODO: Add format filter (snake case, camel case, etc.)
// @TODO: Add empty string/object/array filter

const noop = () => null

export const filters = {
  as ({ node }, { args: [name] }) {
    node.key.name = name
  },
  nullable ({ node }, { flag }) {
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
  exec ({ node, data }, { args: [name, ...args] }) {
    const fn = data[name] ?? noop

    node.options.exec = v => fn(v, ...args)
  }
}

export default class Filter {
  constructor (filter) {
    const [key, params] = filter.split(/(?=\([\w$_,]*\)|$)/g)
    const [name, flag] = key.split(reg.flags)

    this.filter = filter
    this.key = key
    this.params = params
    this.name = name
    this.flag = new Flag(flag)
  }

  get fn () {
    const fn = filters[this.name]

    if (fn) return fn

    throw new FilterNotFoundError(this.name)
  }

  get args () {
    return this.params
      ?.replace(/\(([\w$_,]*)\)/g, '$1')
      .split(',')
      .filter(Boolean)
  }
}
