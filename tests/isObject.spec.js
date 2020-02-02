const isObject = require('../src/isObject')

describe('src/isObject', () => {
  it('should return true if the given value is an object', () => {
    const testObject = isObject({})

    expect(testObject).toBe(true)
  })

  it('should return false if the given value is not an object', () => {
    const testObject = isObject(1)

    expect(testObject).toBe(false)
  }) 
})
