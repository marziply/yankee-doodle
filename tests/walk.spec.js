const walk = require('../src/walk')
const data = require('./data')

const schema = {
  nested: {
    data: {
      items: {
        one: true,
        two: true
      }
    }
  },
  emailAddress: {
    data: {
      items: true
    }
  }
}

describe('src/walk', () => {
  it('should recurse into the depths of the given schema', () => {
    const yanked = {}
    const walked = walk(data, yanked, schema)

    expect(yanked).toEqual({
      nested: {
        data: {
          items: {
            one: 'one',
            two: 'two'
          }
        }
      }
    })
  })

  it('should prune all object properties', () => {
    const yanked = {}
    const walked = walk(data, yanked, schema.emailAddress)

    expect(yanked).toEqual({})
  })
})
