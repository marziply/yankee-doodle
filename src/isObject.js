const { getPrototypeOf } = Object

function isObject (object) {
  return Object.prototype.toString.call(object) === '[object Object]' && object === Object(object)
}

module.exports = isObject
