const { Parser } = require('./parse')
const { Serialiser } = require('./serialise')
const { validate } = require('./validator')

module.exports = function yank (data, ...args) {
  if (!args.length) return data

  validate(args)

  const schema = args
    .flat()
    .join(',')
  const parser = new Parser(schema)
  const serialiser = new Serialiser(data, parser.parse())

  return serialiser.serialise()
}
