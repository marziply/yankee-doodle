import validate, { InvalidTypeError } from '../src/validator.js'

describe('src/validator', () => {
  it('should return the schemas is all schemas are strings', () => {
    const schemas = ['firstName', 'lastName']
    const result = validate(schemas)

    expect(result).toEqual(schemas)
  })

  it('should throw when any of the schemas are not strings', done => {
    const schemas = ['firstName', 42]

    try {
      validate(schemas)
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTypeError)

      done()
    }
  })
})
