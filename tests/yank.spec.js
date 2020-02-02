const yank = require('../src/yank')
const data = require('./data')

describe('src/yank', () => {
  it('when given a collection of properties, should return those values from the data object', () => {
    const yanked = yank(data, 'firstName', 'lastName')

    expect(yanked).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should ignore all properties that do not exist on the data object', () => {
    const yanked = yank(data, 'emailAddress', 'firstName')

    expect(yanked).toEqual({
      firstName: 'John'
    })
  })

  it('should return nested results', () => {
    const yanked = yank(data, 'addressDetails: { city, postcode }')

    expect(yanked).toEqual({
      addressDetails: {
        city: 'London',
        postcode: 'SW1A 2AB'
      }
    })
  })

  it('should return renamed keys that are separated by ->', () => {
    const yanked = yank(data, 'firstName->first_name', 'lastName->last_name')

    expect(yanked).toEqual({
      first_name: 'John',
      last_name: 'Doe'
    })
  })

  it('should throw if any of the arguments after the first are not strings', done => {
    try {
      yank(data, 'firstName', 1, true)
    } catch (e) {
      expect(e).toEqual('All arguments must be strings')

      done()
    }
  })
})
