import { flags, tokens } from './tokens.js'

const { assign } = Object

/**
 * Configures the flags/tokens used by the parser and serialiser.
 *
 * @param {object} [options] - Flag/token config.
 *
 * @returns {object} - Configured options.
 */
export default function configure (options = {}) {
  assign(flags, options.flags ?? {})
  assign(tokens, options.tokens ?? {})

  return {
    flags,
    tokens
  }
}
