const { assign } = Object

/**
 * Serialises a simplified abstract syntax tree and extracts out properties
 * defined within the schema, as well as apply any filters.
 *
 * @param {object} data - Original data to apply the schema to.
 * @param {Array.<Node>} ast - Abstract syntax tree schema data.
 */
export default class Serialiser {
  constructor (data, ast) {
    this.data = data
    this.ast = ast
  }

  /**
   * Yanks properties at a given hierarchal level and applies filters to them.
   *
   * @param {Node} root - Current level node.
   * @param {object} data - Data to extract properties from.
   * @param {Node} parent - Parent level node.
   *
   * @returns {void}
   */
  yank (root, data, parent) {
    const { children, options, key } = root.filter(data)
    const value = this.get(data, key.path, options)
    const set = child => this.set(parent, key, child)

    if (children.length) {
      if (value || options.nullable) {
        const items = this.dig(value, children)

        if (options.extract) {
          assign(parent, items)
        } else {
          set(items)
        }
      }
    } else {
      set(value)
    }
  }

  /**
   * Digs into the next level of hierarchy and yanks all properties from the
   * data source via the AST schema node at that level.
   *
   * @param {object} value - Data to extract properties from.
   * @param {Array.<Node>} children - Child nodes.
   *
   * @returns {object} - Yanked properties.
   */
  dig (value, children) {
    const nullable = children.every(n => !n.options.nullable)
    const result = {}

    if (!value && nullable) return null

    for (const child of children) {
      this.yank(child, value, result)
    }

    return result
  }

  /**
   * Serialises the AST into a data object with properties yanked from the data
   * source.
   *
   * @returns {object} - Yanked properties.
   */
  serialise () {
    for (const node of this.ast) {
      this.yank(node, this.data, this.result)
    }

    return this.result
  }

  /**
   * Similar to Lodash.get, this retrieves properties at the given path.
   *
   * @param {object} item - Data to obtain the value from.
   * @param {Array.<string>} path - Segments of a path to the value.
   * @param {object} [options] - Configuration for retrieving the value.
   *
   * @returns {any | null} - Value at the given path, if it exists.
   */
  get (item, path, options = {}) {
    const value = path.reduce((acc, curr) => acc?.[curr], item)
    const result = options.exec
      ? options.exec(value)
      : value

    return options.nullable
      ? result ?? null
      : result
  }

  /**
   * Sets a vaLue on the given parent value.
   *
   * @param {Node} parent - Parent node value.
   * @param {Key} key - Key instance on the current Node.
   * @param {any} value - Value to set onto the parent node.
   *
   * @returns {void}
   */
  set (parent, key, value) {
    parent[key.name] = value
  }

  result = {}
}
