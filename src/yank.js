const { Parser } = require('./parser')
const { Serialiser } = require('./serialiser')
const { validate } = require('./validator')

module.exports = function yank (data, ...args) {
  const schemas = validate(args.flat())
  const parser = new Parser(schemas)
  const serialiser = new Serialiser(data, parser.parse())

  return serialiser.serialise()
}
