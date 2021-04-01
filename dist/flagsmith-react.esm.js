import React, { useReducer, useEffect, useCallback, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import flagsmith from 'flagsmith';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var FlagsmithContext = /*#__PURE__*/createContext();

var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'INITIALISED':
      {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          isLoading: false,
          isError: false
        });
      }

    case 'IDENTIFIED':
      {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          isIdentified: true
        });
      }

    case 'UNIDENTIFIED':
      {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          isIdentified: false
        });
      }

    case 'ERRORED':
      {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          isLoading: false,
          isError: true
        });
      }
  }
};

var FlagsmithProvider = function FlagsmithProvider(_ref) {
  var environmentId = _ref.environmentId,
      children = _ref.children;

  var _useReducer = useReducer(reducer, {
    isLoading: true,
    isError: false,
    isIdentified: false
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return flagsmith.init({
                environmentID: environmentId
              });

            case 3:
              dispatch({
                type: 'INITIALISED'
              });
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              console.log('Failed');
              dispatch({
                type: 'ERRORED'
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }))();
  }, [environmentId]);
  var identify = useCallback( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(identity) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return flagsmith.identify(identity);

            case 3:
              dispatch({
                type: 'IDENTIFIED'
              });
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              dispatch({
                type: 'UNIDENTIFIED'
              });

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 6]]);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }(), []);
  var hasFeature = useCallback(function (key) {
    return flagsmith.hasFeature(key);
  }, []);
  var getValue = useCallback(function (key) {
    return flagsmith.getValue(key);
  }, []);
  return /*#__PURE__*/React.createElement(FlagsmithContext.Provider, {
    value: _objectSpread2(_objectSpread2({}, state), {}, {
      identify: identify,
      hasFeature: hasFeature,
      getValue: getValue
    })
  }, children);
};

FlagsmithProvider.propTypes = {
  children: PropTypes.any,
  environmentId: PropTypes.string.isRequired
};

var useFlagsmith = function useFlagsmith() {
  var context = useContext(FlagsmithContext);

  if (context === undefined) {
    throw new Error('useFlagsmith must be used with in a FlagsmithProvider');
  }

  return context;
};

export { FlagsmithProvider, useFlagsmith };
