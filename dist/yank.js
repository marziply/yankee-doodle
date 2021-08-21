'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Parser = function () {
  function Parser(schemas) {
    var _this = this;

    _classCallCheck(this, Parser);

    _defineProperty(this, "reg", {
      get keys() {
        return new RegExp(",(?![^(]*[)])|(?<=".concat(Parser.tokens.OPEN, ")"));
      },

      get scopes() {
        var _Parser$tokens = Parser.tokens,
            CLOSE = _Parser$tokens.CLOSE,
            OPEN = _Parser$tokens.OPEN;
        return new RegExp("(?=[".concat(CLOSE, "]+)|(?=").concat(OPEN, ")"));
      },

      get flags() {
        var joined = Object.values(Parser.tokens.FLAGS).map(function (i) {
          return "\\".concat(i);
        }).join('|');
        return new RegExp("(?=".concat(joined, ")"));
      }

    });

    _defineProperty(this, "depth", 0);

    _defineProperty(this, "tree", []);

    this.schemas = schemas;
    this.tokens = this.strip().split(this.reg.keys).map(function (i) {
      return _this.tokenise(i);
    });
  }

  _createClass(Parser, [{
    key: "nodeify",
    value: function nodeify() {
      var _this$tokens$shift = this.tokens.shift(),
          _this$tokens$shift2 = _slicedToArray(_this$tokens$shift, 2),
          token = _this$tokens$shift2[0],
          shift = _this$tokens$shift2[1];

      var _token$split = token.split(Parser.tokens.DIV),
          _token$split2 = _toArray(_token$split),
          key = _token$split2[0],
          args = _token$split2.slice(1);

      var node = {
        children: [],
        filters: this.filterfy(args),
        options: _objectSpread({}, Parser.options),
        key: {
          value: key,
          path: key.split(Parser.tokens.SEG),
          name: key.split(Parser.tokens.SEG).pop()
        }
      };
      return {
        shift: shift,
        node: node
      };
    }
  }, {
    key: "filterfy",
    value: function filterfy(args) {
      var _this2 = this;

      return args.map(function (r) {
        var _r$split = r.split(/(?=\([\w$_,]*\)|$)/g),
            _r$split2 = _slicedToArray(_r$split, 2),
            key = _r$split2[0],
            params = _r$split2[1];

        var _key$split = key.split(_this2.reg.flags),
            _key$split2 = _slicedToArray(_key$split, 2),
            name = _key$split2[0],
            flag = _key$split2[1];

        var args = params === null || params === void 0 ? void 0 : params.replace(/\(([\w$_,]*)\)/g, '$1').split(',').filter(Boolean);
        return {
          name: name,
          args: args !== null && args !== void 0 ? args : [],
          flag: {
            value: flag !== null && flag !== void 0 ? flag : null,
            on: function on(f, cb) {
              return flag === f && cb();
            }
          }
        };
      });
    }
  }, {
    key: "tokenise",
    value: function tokenise(key) {
      var _key$split3 = key.split(this.reg.scopes),
          _key$split4 = _toArray(_key$split3),
          prop = _key$split4[0],
          scopes = _key$split4.slice(1);

      var length = this.measure(scopes);
      return prop === Parser.tokens.CLOSE ? [null, length - 1] : [prop, length];
    }
  }, {
    key: "next",
    value: function next(children) {
      var _this$nodeify = this.nodeify(children),
          node = _this$nodeify.node,
          shift = _this$nodeify.shift;

      var depth = this.depth;
      this.depth += shift;

      while (shift > 0 && this.depth > depth) {
        this.next(node.children);
      }

      if (node.key) children.push(node);
    }
  }, {
    key: "measure",
    value: function measure(scopes) {
      return +scopes.includes(Parser.tokens.OPEN) || -scopes.length || 0;
    }
  }, {
    key: "strip",
    value: function strip() {
      var isNewLine = function isNewLine(match) {
        return match === '\n';
      };

      var isClose = function isClose(val, offset) {
        return val[offset + 1] === Parser.tokens.CLOSE;
      };

      return this.schema.trim().replace(/\s+/g, function (m, v, o) {
        return isNewLine(m) && !isClose(v, o) ? ',' : '';
      });
    }
  }, {
    key: "parse",
    value: function parse() {
      while (this.tokens.length) {
        this.next(this.tree);
      }

      return this.tree;
    }
  }, {
    key: "schema",
    get: function get() {
      return this.schemas.join(',');
    }
  }]);

  return Parser;
}();

_defineProperty(Parser, "options", {
  nullable: false,
  extract: false,
  exec: null
});

_defineProperty(Parser, "tokens", {
  OPEN: ':{',
  CLOSE: '}',
  DIV: '|',
  SEG: '.',
  FLAGS: {
    MACRO: '!'
  }
});

var flags = Parser.tokens.FLAGS;

var noop = function noop() {
  return null;
};

var filters = {
  as: function as(_ref) {
    var node = _ref.node,
        _ref$args = _slicedToArray(_ref.args, 1),
        name = _ref$args[0];

    node.key.name = name;
  },
  nullable: function nullable(_ref2) {
    var node = _ref2.node,
        flag = _ref2.flag;
    node.options.nullable = true;
    flag.on(flags.MACRO, function () {
      var _iterator = _createForOfIteratorHelper(node.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var options = _step.value.options;
          options.nullable = true;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
  },
  extract: function extract(_ref3) {
    var node = _ref3.node;
    node.options.extract = true;
  },
  exec: function exec(_ref4) {
    var _data$name;

    var node = _ref4.node,
        data = _ref4.data,
        _ref4$args = _toArray(_ref4.args),
        name = _ref4$args[0],
        args = _ref4$args.slice(1);

    var fn = (_data$name = data[name]) !== null && _data$name !== void 0 ? _data$name : noop;

    node.options.exec = function (v) {
      return fn.apply(void 0, [v].concat(_toConsumableArray(args)));
    };
  }
};

var InvalidTypeError = function (_Error) {
  _inherits(InvalidTypeError, _Error);

  var _super = _createSuper(InvalidTypeError);

  function InvalidTypeError() {
    var _this3;

    _classCallCheck(this, InvalidTypeError);

    _this3 = _super.apply(this, arguments);
    _this3.message = 'All schemas must be strings';
    return _this3;
  }

  return InvalidTypeError;
}(_wrapNativeSuper(Error));

var FilterNotFoundError = function (_Error2) {
  _inherits(FilterNotFoundError, _Error2);

  var _super2 = _createSuper(FilterNotFoundError);

  function FilterNotFoundError(name) {
    var _this4;

    _classCallCheck(this, FilterNotFoundError);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _this4 = _super2.call.apply(_super2, [this].concat(args));
    _this4.message = "Filter \"".concat(name, "\" could not be found");
    _this4.data = name;
    return _this4;
  }

  return FilterNotFoundError;
}(_wrapNativeSuper(Error));

function validate(schemas) {
  var typeIndex = schemas.findIndex(function (a) {
    return typeof a !== 'string';
  });
  if (typeIndex >= 0) throw new InvalidTypeError(schemas[typeIndex]);
  return schemas;
}

var assign = Object.assign;

var Serialiser = function () {
  function Serialiser(data, ast) {
    _classCallCheck(this, Serialiser);

    _defineProperty(this, "result", {});

    this.data = data;
    this.ast = ast;
  }

  _createClass(Serialiser, [{
    key: "yank",
    value: function yank(node, data, parent) {
      this.filter({
        node: node,
        data: data,
        parent: parent
      });
      var value = this.get(data, node.key.path, node.options);
      var set = this.set.bind(this, node, parent);

      if (node.children.length) {
        if (value || node.options.nullable) {
          var children = this.dig(node, value);

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
  }, {
    key: "dig",
    value: function dig(node, data) {
      var result = {};
      var nullable = node.children.every(function (n) {
        return !n.options.nullable;
      });
      if (!data && nullable) return null;

      var _iterator2 = _createForOfIteratorHelper(node.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var child = _step2.value;
          this.yank(child, data, result);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return result;
    }
  }, {
    key: "filter",
    value: function filter(params) {
      var _iterator3 = _createForOfIteratorHelper(params.node.filters),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _step3.value,
              name = _step3$value.name,
              flag = _step3$value.flag,
              args = _step3$value.args;
          var filter = filters[name];
          var merged = assign(params, {
            flag: flag,
            args: args
          });
          if (!filter) throw new FilterNotFoundError(name);
          filter(merged);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "serialise",
    value: function serialise() {
      var _iterator4 = _createForOfIteratorHelper(this.ast),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var node = _step4.value;
          this.yank(node, this.data, this.result);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return this.result;
    }
  }, {
    key: "get",
    value: function get(data, path, options) {
      var value = path.reduce(function (acc, curr) {
        return acc === null || acc === void 0 ? void 0 : acc[curr];
      }, data);
      var result = options.exec ? options.exec(value) : value;
      return options.nullable ? result !== null && result !== void 0 ? result : null : result;
    }
  }, {
    key: "set",
    value: function set(node, parent, value) {
      parent[node.key.name] = value;
    }
  }]);

  return Serialiser;
}();

function yank(data) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var schemas = validate(args.flat());
  var parser = new Parser(schemas);
  var serialiser = new Serialiser(data, parser.parse());
  return serialiser.serialise();
}

module.exports = yank;
