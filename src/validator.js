function validate (schemas) {
  if (schemas.some(arg => typeof arg !== 'string')) {
    throw new Error('All schemas must be strings')
  }
}

module.exports = {
  validate
}
