const { parse } = require('./parse')
const { serialise } = require('./serialise')

function validate (schemas) {
  if (schemas.some(arg => typeof arg !== 'string')) {
    throw new Error('All schemas must be strings')
  }
}

module.exports = function yank (data, ...args) {
  if (!args.length) return data

  validate(args)

  const schema = args
    .flat()
    .join(',')

  return serialise(data, parse(schema))
}
