import Parser from './parser.js'
import Serialiser from './serialiser.js'
import validate from './validator.js'

export default function yank (data, ...args) {
  const schemas = validate(args.flat())
  const parser = new Parser(schemas)
  const serialiser = new Serialiser(data, parser.parse())

  return serialiser.serialise()
}
