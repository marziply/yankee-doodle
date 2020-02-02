const prune = require('../src/prune')

const yanked = {
  firstName: 'John',
  lastName: 'Doe',
  addressDetails: {}
}

describe('src/prune', () => {
  it('should prune empty objects from the given data object', () => {
    const pruned = prune(yanked)

    expect(yanked).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })
})
