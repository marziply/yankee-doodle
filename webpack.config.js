const webpack = require('webpack')

const env = process.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
  mode: env,
  entry: __dirname + '/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'yankee-doodle.min.js'
  }
}
