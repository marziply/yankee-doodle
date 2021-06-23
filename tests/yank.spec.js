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

  it('should return undefined properties when using nullify', done => {
    const data = { exists: 'one', yank: 'two' }
    const nullify = (...args) => yank.call({ nullify: true }, ...args)
    const yanked = nullify(data, ['exists', 'notexists'])
    expect(yanked).toEqual({
      exists: 'one',
      notexists: null
    })
    done()
  })

  it('should return undefined properties when using nullify within nested properties', done => {
    const data = {
      yank: 'one',
      nested: {
        exists: 'two'
      }
    }
    
    const nullify = (...args) => yank.call({ nullify: true }, ...args)
    const nullYanked = nullify(data, ['nested: { notexists, exists }'])
    const yanked = yank(data, ['exists', 'nested: { notexists, exists }'])
    
    expect(nullYanked).toEqual({
      nested: {
        notexists: null,
        exists: 'two'
      }
    })
    
    expect(yanked).toEqual({
      nested: {
        exists: 'two'
      }
    })

    done()
  })
  
  it('should return undefined properties when using nullify within renamed properties', done => {
    const data = {
      yank: 'one',
      nested: {
        exists: 'two'
      }
    }
    
    const data2 = {
      yank: 'one',
      nested: {
        exists: 'two',
        notexists: 'three'
      }
    }
    
    const nullify = (...args) => yank.call({ nullify: true }, ...args)

    const schema = ['nested: { notexists->forced, exists }']
    const nullYanked = nullify(data, schema)
    const nullYanked2 = yank(data2, schema)
    const yanked = yank(data, schema)
    
    expect(nullYanked).toEqual({
      nested: {
        forced: null,
        exists: 'two'
      }
    })
    
    expect(nullYanked).not.toEqual({
      nested: {
        notexists: null,
        exists: 'two'
      }
    })
    
    expect(yanked).toEqual({
      nested: {
        exists: 'two'
      }
    })
    
    expect(nullYanked2).toEqual({
      nested: {
        forced: 'three',
        exists: 'two',
      }
    })

    done()
  })
})
