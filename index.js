const yank = require('./lib/yank')

yank.nullify = (...args) => yank.call({ nullify: true }, ...args)

module.exports = yank
