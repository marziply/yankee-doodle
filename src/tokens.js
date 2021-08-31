export const reg = {
  get keys () {
    return new RegExp(`,(?![^(]*[)])|(?<=${tokens.OPEN})`)
  },
  get scopes () {
    return new RegExp(`(?=[${tokens.CLOSE}]+)|(?=${tokens.OPEN})`)
  },
  get flags () {
    const joined = Object
      .values(flags)
      .map(i => `\\${i}`)
      .join('|')

    return new RegExp(`(?=${joined})`)
  }
}

export const flags = {
  MACRO: '!',
  // @NOTE: Not implemented yet.
  COND: '?'
}

export const tokens = {
  OPEN: ':{',
  CLOSE: '}',
  DIV: '|',
  SEG: '.'
}

export default tokens
