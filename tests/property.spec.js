import Property from '../src/property.js'

describe('src/property', () => {
  describe('constructor', () => {
    it('should set value, path, name', () => {
      const name = 'parent.child'
      const prop = new Property(name)

      expect(prop.value).toEqual(name)
      expect(prop.path).toEqual(['parent', 'child'])
      expect(prop.name).toEqual('child')
    })
  })
})
