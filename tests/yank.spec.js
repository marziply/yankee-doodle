import yank from '../src/yank.js'
import data from './data.json'

describe('src/yank', () => {
  it('should yank provided properties from a data object', () => {
    const result = yank(data, 'firstName', 'lastName')

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should yank provided properties as an array from a data object', () => {
    const result = yank(data, [
      'firstName',
      'lastName'
    ])

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should ignore all properties that do not exist on the data object', () => {
    const result = yank(data, 'emailAddress', 'firstName')

    expect(result.emailAddress).toBeUndefined()
    expect(result).toEqual({
      firstName: 'John'
    })
  })

  it('should return nested results', () => {
    const result = yank(data, `
      addressDetails: {
        city,
        postcode
      }
    `)

    expect(result).toEqual({
      addressDetails: {
        city: 'London',
        postcode: 'SW1A 2AB'
      }
    })
  })

  it('should return properties via a property path', () => {
    const result = yank(data, 'nested.data.items.one')

    expect(result).toEqual({
      one: 'one'
    })
  })
})
