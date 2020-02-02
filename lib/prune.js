const isObject = require('./isObject')

function prune (yanked) {
  for (const [key, value] of entries(yanked)) {
    const { length } = Object.values(value)

    if (!length && isObject(value)) delete yanked[key]
  }
}

module.exports = prune
