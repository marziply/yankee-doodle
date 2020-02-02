const prune = require('./prune')

const { entries, values } = Object

function walk (object, yanked, schema) {
  for (const [key, value] of entries(schema)) {
    const [originalKey, renamedKey] = key.split('->')
    const newKey = renamedKey || originalKey

    if (!!object && object.hasOwnProperty(originalKey)) {
      const { length } = values(value || {})

      if (length) walk(object[originalKey], yanked[newKey] = {}, schema[key])
      else yanked[newKey] = object[originalKey]
    }

    prune(yanked)
  }
}

module.exports = walk
