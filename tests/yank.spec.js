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
})
