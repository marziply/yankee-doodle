const yank = require('../src/yank')
const data = require('./data')

describe('src/yank', () => {
  it('should yank provided properties from a data object', () => {
    const yanked = yank(data, 'firstName', 'lastName')

    expect(yanked).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should yank provided properties as an array from a data object', () => {
    const yanked = yank(data, [
      'firstName',
      'lastName'
    ])

    expect(yanked).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should ignore all properties that do not exist on the data object', () => {
    const yanked = yank(data, 'emailAddress', 'firstName')

    expect(yanked.emailAddress).toBeUndefined()
    expect(yanked).toEqual({
      firstName: 'John'
    })
  })

  it('should return nested results', () => {
    const yanked = yank(data, `
      addressDetails: {
        city,
        postcode
      }
    `)

    expect(yanked).toEqual({
      addressDetails: {
        city: 'London',
        postcode: 'SW1A 2AB'
      }
    })
  })
})
