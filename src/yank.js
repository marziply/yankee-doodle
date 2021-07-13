const walk = require('./walk')
const parse = require('./parse')
// const isObject = require('./isObject')

function validate (schemas) {
  if (schemas.some(arg => typeof arg !== 'string')) {
    throw new Error('All schemas must be strings')
  }
}

module.exports = function yank (data, ...args) {
  if (!args.length) return data

  validate(args)

  const yanked = {}
  const schema = args
    .flat()
    .join(',')

  for (const ast of parse(schema)) {
    walk(data, yanked, schema)
  }

  return yanked
}
