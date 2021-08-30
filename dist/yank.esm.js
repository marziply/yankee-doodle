const reg = {
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
      .join('|');

    return new RegExp(`(?=${joined})`)
  }
};

const flags = {
  MACRO: '!',
  COND: '?'
};

const tokens = {
  OPEN: ':{',
  CLOSE: '}',
  DIV: '|',
  SEG: '.'
};

class InvalidTypeError extends Error {
  constructor () {
    super(...arguments);

    this.message = 'All schemas must be strings';
  }
}

class FilterNotFoundError extends Error {
  constructor (name, ...args) {
    super(...args);

    this.message = `Filter "${name}" could not be found`;
    this.data = name;
  }
}

/**
 * Validate the provided schema matches the syntax allowed for yanking
 * properties via this package.
 *
 * @param {Array.<string>} schemas - Set of schemas to yank against.
 *
 * @returns {Array.<string>} - The given value if nothing failed.
 *
 * @throws {Error} - Invalid type.
 */
function validate (schemas) {
  const typeIndex = schemas.findIndex(a => typeof a !== 'string');

  if (typeIndex >= 0) throw new InvalidTypeError(schemas[typeIndex])

  return schemas
}

class Flag {
  constructor (flag) {
    this.flag = flag;
  }

  on (flag, callback) {
    if (this.flag === flag) {
      callback();
    }
  }
}

// @TODO: Add format filter (snake case, camel case, etc.)
// @TODO: Add empty string/object/array filter

const noop = () => null;

const filters = {
  as ({ node }, { args: [name] }) {
    node.key.name = name;
  },
  nullable ({ node }, { flag }) {
    node.options.nullable = true;

    flag.on(flags.MACRO, () => {
      for (const { options } of node.children) {
        options.nullable = true;
      }
    });
  },
  extract ({ node }) {
    node.options.extract = true;
  },
  exec ({ node, data }, { args: [name, ...args] }) {
    const fn = data[name] ?? noop;

    node.options.exec = v => fn(v, ...args);
  }
};

class Filter {
  constructor (filter) {
    const [key, params] = filter.split(/(?=\([\w$_,]*\)|$)/g);
    const [name, flag] = key.split(reg.flags);

    this.filter = filter;
    this.key = key;
    this.params = params;
    this.name = name;
    this.flag = new Flag(flag);
  }

  get fn () {
    const fn = filters[this.name];

    if (fn) return fn

    throw new FilterNotFoundError(this.name)
  }

  get args () {
    return this.params
      ?.replace(/\(([\w$_,]*)\)/g, '$1')
      .split(',')
      .filter(Boolean)
  }
}

class Property {
  constructor (name) {
    this.value = name;
    this.path = name.split(tokens.SEG);
    this.name = this.path.at(-1);
  }
}

class Node {
  constructor (token, shift) {
    const [name, ...args] = token.split(tokens.DIV);

    this.token = token;
    this.shift = shift;
    this.name = name;
    this.args = args;
    this.key = new Property(name);
    this.filters = args.map(arg => new Filter(arg));
  }

  children = []

  options = {
    ...Node.options
  }

  static options = {
    nullable: false,
    extract: false,
    exec: null
  }
}

/**
 * Parses the given schemas into a somewhat simplified abstract syntax tree
 * (AST) which enables modules later on to decipher the properties to pick from
 * the given data object.
 *
 * @param {Array.<string>} schemas - Set of schemas to generate the AST from.
 */
class Parser {
  constructor (schemas) {
    this.schema = schemas.join(',');
    this.tokens = this
      .strip()
      .split(reg.keys)
      .map(i => this.tokenise(i));
  }

  /**
   * Generates a new node from the next item in the tokens queue.
   *
   * @returns {object} - Generated node.
   */
  nodeify () {
    const [token, shift] = this.tokens.shift();
    const node = new Node(token, shift);

    return {
      shift,
      node
    }
  }

  /**
   * Tokenises the given key into an array of key name and its respective
   * scope depth. Lengths more than 0 increase the depth of the scope, 0
   * changes nothing, and lengths less than 0 decrease the depth of the
   * scope.
   *
   * @param {string} key - Token item to determine the depth value.
   *
   * @returns {Array.<string|null, number>} - Defined depth per schema key.
   */
  tokenise (key) {
    const [prop, ...scopes] = key.split(reg.scopes);
    const length = this.measure(scopes);

    return prop === tokens.CLOSE
      ? [null, length - 1]
      : [prop, length]
  }

  /**
   * Retrieves the next top-level token in the tokens array and then descends
   * into all of it's children tokens.
   *
   * @param {Array.<Node>} parent - Parent node array to push children to.
   *
   * @returns {void}
   */
  next (parent) {
    const { node, shift } = this.nodeify(parent);
    const depth = this.depth;

    this.depth += shift;

    while (shift > 0 && this.depth > depth) {
      this.next(node.children);
    }

    if (node.key) parent.push(node);
  }

  /**
   * Measures the length of the given scope from a series of tokens.
   *
   * @param {Array.<string>} chars - Token strings to measure scope from.
   *
   * @returns {number} - Scope size.
   */
  measure (chars) {
    return +chars.includes(tokens.OPEN) || -chars.length || 0
  }

  /**
   * Strips all whitespace from the schema while also joining newlines between
   * properties with a comma.
   *
   * @returns {string} - Stripped schema.
   */
  strip () {
    const isNewLine = match => match === '\n';
    const isClose = (val, offset) => val[offset + 1] === tokens.CLOSE;

    return this.schema
      .trim()
      .replace(/\s+/g, (m, v, o) => isNewLine(m) && !isClose(v, o) ? ',' : '')
  }

  /**
   * Parses all tokens in the schema into a really simple abstract syntax tree
   * for the serialiser to iterate through.
   *
   * @returns {Array.<Node>} - Abstract syntax tree of token nodes.
   */
  parse () {
    while (this.tokens.length) {
      this.next(this.tree);
    }

    return this.tree
  }

  depth = 0

  tree = []
}

const { assign } = Object;

/**
 * Serialises a simplified abstract syntax tree and extracts out properties
 * defined within the schema, as well as apply any filters.
 *
 * @param {object} data - Original data to apply the schema to.
 * @param {Array.<Node>} ast - Abstract syntax tree schema data.
 */
class Serialiser {
  constructor (data, ast) {
    this.data = data;
    this.ast = ast;
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
    this.filter(node, data);

    const value = this.get(data, node.key.path, node.options);
    const set = this.set.bind(this, node, parent);

    if (node.children.length) {
      if (value || node.options.nullable) {
        const children = this.dig(node, value);

        if (node.options.extract) {
          assign(parent, children);
        } else {
          set(children);
        }
      }
    } else {
      set(value);
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
    const result = {};
    const nullable = node.children.every(n => !n.options.nullable);

    if (!data && nullable) return null

    for (const child of node.children) {
      this.yank(child, data, result);
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
    };

    for (const { fn, flag, args } of node.filters) {
      fn(params, {
        flag,
        args
      });
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
      this.yank(node, this.data, this.result);
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
    const value = path.reduce((acc, curr) => acc?.[curr], data);
    const result = options.exec
      ? options.exec(value)
      : value;

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
    parent[node.key.name] = value;
  }

  result = {}
}

/**
 * Yanks properties from a given data object via a set of schemas. Values are
 * yanked from the data object based on keys provided within the schema, which
 * individually can be filtered to be transform or otherwise rejected from the
 * output.
 *
 * @param {object} data - Data to yank properties from.
 * @param {...string|Array.<string>} args - Collection of schemas.
 *
 * @returns {object} - Data picked from source object via the schema.
 */
function yank (data, ...args) {
  const schemas = validate(args.flat());
  const parser = new Parser(schemas);
  const serialiser = new Serialiser(data, parser.parse());

  return serialiser.serialise()
}

export { yank as default };
