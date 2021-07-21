const errors = {
  invalidType: () => new Error('All schemas must be strings'),
  filterNotFound: s => new Error(`Filter "${s}" could not be found`)
}

function validate (schemas) {
  const typeIndex = schemas.findIndex(a => typeof a !== 'string')

  if (typeIndex >= 0) throw errors.invalidType(schemas[typeIndex])

  return schemas
}

module.exports = {
  validate,
  errors
}
