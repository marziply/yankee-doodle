export class InvalidTypeError extends Error {
  constructor () {
    super(...arguments)

    this.message = 'All schemas must be strings'
  }
}

export class FilterNotFoundError extends Error {
  constructor (name, ...args) {
    super(...args)

    this.message = `Filter "${name}" could not be found`
    this.data = name
  }
}

/**
 * Validate the provided schema matches the syntax allowed for yanking
 * properties via this package.
 *
 * @param {Array.<string>} schemas - Set of schemas to yank against.
 *
 * @returns {Array.<string>} - The given value if nothing failed.
 *
 * @throws {Error} - Invalid type.
 */
export default function validate (schemas) {
  const typeIndex = schemas.findIndex(a => typeof a !== 'string')

  if (typeIndex >= 0) throw new InvalidTypeError(schemas[typeIndex])

  return schemas
}
