const webpack = require('webpack')

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
  mode: env,
  entry: './index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'yankee-doodle.min.js'
  }
}
