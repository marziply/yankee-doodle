module.exports = {
  env: {
    commonjs: true,
    node: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    esmaVersion: 9
  },
  sourceType: 'module',
  rules: {
    'new-cap': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'linebreak-style': [ 'error', 'unix' ],
    indent: [ 'error', 2 ],
    quotes: [ 'error', 'single' ],
    semi: [ 'error', 'never' ]
  }
}
