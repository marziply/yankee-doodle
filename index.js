const yank = require('./src/yank')

yank.nullify = (...args) => yank.call({ nullify: true }, ...args)

module.exports = yank
