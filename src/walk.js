const prune = require('./prune')

const { entries, values } = Object

function walk (object, yanked, schema, nullify) {
  for (const [key, value] of entries(schema)) {
    const [originalKey, renamedKey] = key.split('->')
    const newKey = renamedKey || originalKey

    if (!!object && typeof object[originalKey] !== 'undefined') {
      const { length } = values(value || {})

      if (length) walk(object[originalKey], yanked[newKey] = {}, schema[key], nullify)
      else yanked[newKey] = object[originalKey]
    } else if (nullify) {
        yanked[newKey] = null
    }

    prune(yanked)
  }
}

module.exports = walk
