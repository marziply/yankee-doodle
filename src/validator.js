const errors = {
  invalidType: s => new Error(`All schemas must be strings: ${s}`)
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
