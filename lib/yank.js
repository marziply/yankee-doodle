const walk = require('./walk')
const isObject = require('./isObject')

function yank (object, ...args) {
  if (args.length === 0) return object

  const schemaList = args.flat()
  const yanked = {}

  if (!schemaList.every(arg => typeof arg === 'string')) throw 'All arguments must be strings'

  for (const schema of schemaList) {
    const parsedArgs = schema
      .replace(/\s+/g, '')
      .replace(/([\w->]+)/g, '"$1"')
      .replace(/((?<!}),|(?<=")\s?}|(?<!})$)/g, ':0$1')
    const parsedSchema = JSON.parse(`{${parsedArgs}}`)

    walk(object, yanked, parsedSchema)
  }

  if (this && this.nullify && isObject(yanked)) {
    const { length } = Object.values(yanked)

    if (!length) return null
  }

  return yanked
}

yank.nullify = (...args) => yank.call({ nullify: true }, ...args)

module.exports = yank
