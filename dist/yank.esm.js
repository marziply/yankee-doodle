/**
 * Parses the given schemas into a somewhat simplified abstract syntax tree
 * (AST) which enables modules later on to decipher the properties to pick from
 * the given data object.
 *
 * @param {Array.<string>} schemas - Set of schemas to generate the AST from.
 */
class Parser {
  constructor (schemas) {
    this.schemas = schemas;
    this.tokens = this
      .strip()
      .split(this.reg.keys)
      .map(i => this.tokenise(i));
  }

  /**
   * Generates a new node from the next item in the tokens queue.
   *
   * @returns {object} - Generated node.
   */
  nodeify () {
    const [token, shift] = this.tokens.shift();
    const [key, ...args] = token.split(Parser.tokens.DIV);
    const node = {
      children: [],
      filters: this.filterfy(args),
      options: {
        ...Parser.options
      },
      key: {
        value: key,
        path: key.split(Parser.tokens.SEG),
        name: key
          .split(Parser.tokens.SEG)
          .pop()
      }
    };

    return {
      shift,
      node
    }
  }

  /**
   * Generates a set of filters from the given property.
   *
   * @param {Array.<string>} args - Filter arguments.
   *
   * @returns {Array.<object>} - Property filter schemas.
   */
  filterfy (args) {
    return args.map(r => {
      const [key, params] = r.split(/(?=\([\w$_,]*\)|$)/g);
      const [name, flag] = key.split(this.reg.flags);
      const args = params
        ?.replace(/\(([\w$_,]*)\)/g, '$1')
        .split(',')
        .filter(Boolean);

      return {
        name,
        args: args ?? [],
        flag: {
          value: flag ?? null,
          on: (f, cb) => flag === f && cb()
        }
      }
    })
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
    const [prop, ...scopes] = key.split(this.reg.scopes);
    const length = this.measure(scopes);

    return prop === Parser.tokens.CLOSE
      ? [null, length - 1]
      : [prop, length]
  }

  next (children) {
    const { node, shift } = this.nodeify(children);
    const depth = this.depth;

    this.depth += shift;

    while (shift > 0 && this.depth > depth) {
      this.next(node.children);
    }

    if (node.key) children.push(node);
  }

  measure (scopes) {
    return +scopes.includes(Parser.tokens.OPEN) || -scopes.length || 0
  }

  strip () {
    const isNewLine = match => match === '\n';
    const isClose = (val, offset) => val[offset + 1] === Parser.tokens.CLOSE;

    return this.schema
      .trim()
      .replace(/\s+/g, (m, v, o) => isNewLine(m) && !isClose(v, o) ? ',' : '')
  }

  parse () {
    while (this.tokens.length) {
      this.next(this.tree);
    }

    return this.tree
  }

  reg = {
    get keys () {
      return new RegExp(`,(?![^(]*[)])|(?<=${Parser.tokens.OPEN})`)
    },
    get scopes () {
      const { CLOSE, OPEN } = Parser.tokens;

      return new RegExp(`(?=[${CLOSE}]+)|(?=${OPEN})`)
    },
    get flags () {
      const joined = Object
        .values(Parser.tokens.FLAGS)
        .map(i => `\\${i}`)
        .join('|');

      return new RegExp(`(?=${joined})`)
    }
  }

  depth = 0

  tree = []

  get schema () {
    return this.schemas.join(',')
  }

  static options = {
    nullable: false,
    extract: false,
    exec: null
  }

  static tokens = {
    OPEN: ':{',
    CLOSE: '}',
    DIV: '|',
    SEG: '.',
    FLAGS: {
      MACRO: '!'
    }
  }
}

const flags = Parser.tokens.FLAGS;

// @TODO: Add format filter (snake case, camel case, etc.)
// @TODO: Add empty string/object/array filter

const noop = () => null;

var filters = {
  as ({ node, args: [name] }) {
    node.key.name = name;
  },
  nullable ({ node, flag }) {
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
  exec ({ node, data, args: [name, ...args] }) {
    const fn = data[name] ?? noop;

    node.options.exec = v => fn(v, ...args);
  }
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

const { assign } = Object;

class Serialiser {
  constructor (data, ast) {
    this.data = data;
    this.ast = ast;
  }

  yank (node, data, parent) {
    this.filter({
      node,
      data,
      parent
    });

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

  dig (node, data) {
    const result = {};
    const nullable = node.children.every(n => !n.options.nullable);

    if (!data && nullable) return null

    for (const child of node.children) {
      this.yank(child, data, result);
    }

    return result
  }

  filter (params) {
    for (const { name, flag, args } of params.node.filters) {
      const filter = filters[name];
      const merged = assign(params, {
        flag,
        args
      });

      if (!filter) throw new FilterNotFoundError(name)

      filter(merged);
    }
  }

  serialise () {
    for (const node of this.ast) {
      this.yank(node, this.data, this.result);
    }

    return this.result
  }

  get (data, path, options) {
    const value = path.reduce((acc, curr) => acc?.[curr], data);
    const result = options.exec
      ? options.exec(value)
      : value;

    return options.nullable
      ? result ?? null
      : result
  }

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
