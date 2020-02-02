const { getPrototypeOf } = Object

function isObject (object) {
  let proto = object

  while ((proto = getPrototypeOf(proto)) !== null)

  if (getPrototypeOf(object) === proto) return true
}

module.exports = isObject
