/**
 * Checks if the given value is a plain JavaScript object.
 *
 * @param {object} object - Object to check.
 *
 * @returns {boolean} - Is the value a plain JavaScript object?
 */
module.exports = function isObject (object) {
  const raw = Object.prototype.toString.call(object)

  return raw === '[object Object]' && object === Object(object)
}
