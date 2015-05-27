'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var declWhitelist = ['extends'],
    declFilter = new RegExp('^(' + declWhitelist.join('|') + ')$'),
    matchImports = /^([\w ]+) from ("([^"]+)"|'([^']+)')$/;

var processor = function processor(css, result) {
  var imports = {};

  // Find any declaration that supports imports
  css.eachDecl(declFilter, function (decl) {
    var matches = decl.value.match(matchImports);
    if (matches) {
      (function () {
        var _matches = _slicedToArray(matches, 5);

        var _ = _matches[0];
        var symbols = _matches[1];
        var _ = _matches[2];
        var doubleQuotePath = _matches[3];
        var singleQuotePath = _matches[4];
        var path = doubleQuotePath || singleQuotePath;
        imports[path] = imports[path] || {};
        var tmpSymbols = symbols.split(' ').map(function (s) {
          return imports[path][s] = '__tmp_' + s + '_' + processor.getRandomStr();
        });
        decl.value = tmpSymbols.join(' ');
      })();
    }
  });

  // If we've found any imports, insert :import rules
  Object.keys(imports).forEach(function (path) {
    var pathImports = imports[path];
    css.prepend(_postcss2['default'].rule({
      selector: ':import("' + path + '")',
      before: '\n',
      nodes: Object.keys(pathImports).map(function (importedSymbol) {
        return _postcss2['default'].decl({
          prop: importedSymbol,
          value: pathImports[importedSymbol],
          before: '\n  '
        });
      })
    }));
  });
};

processor.defaultRandomStr = function () {
  return Math.random().toString(36).substr(2, 8);
};
processor.getRandomStr = processor.defaultRandomStr; // Easy to be mocked out

exports['default'] = processor;
module.exports = exports['default'];
