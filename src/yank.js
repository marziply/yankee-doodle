import Parser from './parser.js'
import Serialiser from './serialiser.js'
import validate from './validator.js'

/**
 * Yanks properties from a given data object via a set of schemas. Values are
 * yanked from the data object based on keys provided within the schema, which
 * individually can be filtered to be transform or otherwise rejected from the
 * output.
 *
 * @param {object} data - Data to yank properties from.
 * @param {...string|Array.<string>} args - Collection of schemas.
 *
 * @returns {object} - Data picked from source object via the schema.
 */
export default function yank (data, ...args) {
  const schemas = validate(args.flat())
  const parser = new Parser(schemas)
  const serialiser = new Serialiser(data, parser.parse())

  return serialiser.serialise()
}
