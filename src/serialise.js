class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }
}

function serialise (data, ast) {
  const serialiser = new Serialiser(data, ast)

  return serialiser.serialise()
}

module.exports = {
  Serialiser,
  serialise
}
