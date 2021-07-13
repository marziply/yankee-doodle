const filters = require('./filters')

class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }

  serialise () {
    return this.result
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
