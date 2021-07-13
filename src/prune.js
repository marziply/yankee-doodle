const isObject = require('./isObject')

const { entries, values } = Object

module.exports = function prune (yanked) {
  for (const [key, value] of entries(yanked)) {
    const { length } = values(value || {})

    if (isObject(value) && !length) delete yanked[key]
  }
}
