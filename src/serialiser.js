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
   * @param {Node} node - Current level node.
   * @param {object} data - Data to extract properties from.
   * @param {Node} parent - Parent level node.
   *
   * @returns {void}
   */
  yank (node, data, parent) {
    this.filter(node, data)

    const value = this.get(data, node.key.path, node.options)
    const set = this.set.bind(this, node, parent)

    if (node.children.length) {
      if (value || node.options.nullable) {
        const children = this.dig(node, value)

        if (node.options.extract) {
          assign(parent, children)
        } else {
          set(children)
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
   * @param {Node} node - Current level node.
   * @param {object} data - Data to extract properties from.
   *
   * @returns {object} - Yanked properties.
   */
  dig (node, data) {
    const result = {}
    const nullable = node.children.every(n => !n.options.nullable)

    if (!data && nullable) return null

    for (const child of node.children) {
      this.yank(child, data, result)
    }

    return result
  }

  /**
   * Applies filters defined in the AST schema with parameters set within the
   * schema.
   *
   * @param {Node} node - Current level node.
   * @param {object} data - Data to extract properties from.
   *
   * @returns {object} - Params with filters applied.
   */
  filter (node, data) {
    const params = {
      node,
      data
    }

    for (const { fn, flag, args } of node.filters) {
      fn(params, {
        flag,
        args
      })
    }
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
   * @param {object} data - Data to obtain the value from.
   * @param {Array.<string>} path - Segments of a path to the value.
   * @param {object} options - Configuration for retrieving the value.
   *
   * @returns {any | null} - Value at the given path, if it exists.
   */
  get (data, path, options) {
    const value = path.reduce((acc, curr) => acc?.[curr], data)
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
   * @param {Node} node - Current level node.
   * @param {Node} parent - Parent node value.
   * @param {any} value - Value to set onto the parent node.
   *
   * @returns {void}
   */
  set (node, parent, value) {
    parent[node.key.name] = value
  }

  result = {}
}
