import tokens from './tokens.js'

export default class Property {
  constructor (name) {
    this.value = name
    this.path = name.split(tokens.SEG)
    this.name = this.path.at(-1)
  }
}
