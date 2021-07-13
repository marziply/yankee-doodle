// const prune = require('./prune')
//
// const { entries, values } = Object
//
// module.exports = function walk (object, yanked, schema, nullify) {
//   for (const [key, value] of entries(schema)) {
//     const [originalKey, renamedKey] = key.split('->')
//     const newKey = renamedKey || originalKey
//     const isDefined = !!object && typeof object[originalKey] !== 'undefined'
//     
//     if (!!object && (isDefined || nullify)) {
//       const { length } = values(value || {})
//             
//       if (length) {
//         // If nullify, then provide an empty object for the nested schema to walk
//         const nextObject = object[originalKey] || {}
//         walk(nextObject, yanked[newKey] = {}, schema[key], nullify)
//       } else if (isDefined) {
//         yanked[newKey] = object[originalKey]
//       } else if (nullify) {
//         yanked[newKey] = null
//       }
//     }
//
//     prune(yanked)
//   }
// }

module.exports = function walk () {}
