const prune = require('./prune')

function walk (object, yanked, schema) {
  for (const [key, value] of entries(schema)) {
    const [originalKey, renamedKey] = key.split('->')
    const newKey = renamedKey || originalKey

    if (!!object && object.hasOwnProperty(originalKey)) {
      const { length } = Object.values(value || {})

      if (length) walk(object[originalKey], yanked[newKey] = {}, schema[key])
      else yanked[newKey] = object[originalKey]
    }

    prune(yanked)
  }
}

module.exports = walk
