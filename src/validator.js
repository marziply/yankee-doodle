export const errors = {
  invalidType: () => new Error('All schemas must be strings'),
  filterNotFound: s => new Error(`Filter "${s}" could not be found`)
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

  if (typeIndex >= 0) throw errors.invalidType(schemas[typeIndex])

  return schemas
}
