import fs from 'fs';
import { EOL } from 'os';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var cached = {};

var LineReader =
/*#__PURE__*/
function () {
  function LineReader(path) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$bufferSize = _ref.bufferSize,
        bufferSize = _ref$bufferSize === void 0 ? 10240 : _ref$bufferSize,
        _ref$encoding = _ref.encoding,
        encoding = _ref$encoding === void 0 ? 'utf8' : _ref$encoding;

    _classCallCheck(this, LineReader);

    this._bufferSize = bufferSize;
    this._encoding = encoding;
    this.fstat = this.fpath = null;

    if (!(path && this.open(path))) {
      throw new Error(path + ' is not a file');
    }
  }

  _createClass(LineReader, [{
    key: "open",
    value: function open(path) {
      this.fstat = fs.statSync(path);
      return this.fstat.isFile && !!(this.fpath = path);
    }
  }, {
    key: "size",
    value: function size() {
      if (cached[this.fstat.mtimeMs]) {
        return cached[this.fstat.mtimeMs];
      }

      var count = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ = _step.value;
          count++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return cached[this.fstat.mtimeMs] = count;
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      var _this = this;

      var buffer = Buffer.alloc(this._bufferSize);
      var fd = fs.openSync(this.fpath, 'r');
      var remaining = '';

      var next = function next() {
        if (fd === 0) {
          return {
            value: undefined,
            done: true
          };
        }

        var lineBreak;

        while ((lineBreak = remaining.match(/\r?\n/)) === null) {
          var bytesReadNum = fs.readSync(fd, buffer, 0, buffer.byteLength, null);

          if (bytesReadNum !== 0) {
            remaining += buffer.toString(_this._encoding, 0, bytesReadNum);
          } else {
            fs.closeSync(fd);
            fd = 0;
            return {
              value: remaining,
              done: false
            };
          }
        }

        var line = remaining.substring(0, lineBreak.index);
        remaining = remaining.substring(lineBreak.index + lineBreak[0].length);
        return {
          value: line,
          done: false
        };
      };

      return {
        next: next
      };
    }
  }]);

  return LineReader;
}();

var FileWriter =
/*#__PURE__*/
function () {
  function FileWriter(path) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$append = _ref.append,
        append = _ref$append === void 0 ? false : _ref$append,
        _ref$overwrite = _ref.overwrite,
        overwrite = _ref$overwrite === void 0 ? true : _ref$overwrite,
        _ref$encoding = _ref.encoding,
        encoding = _ref$encoding === void 0 ? 'utf8' : _ref$encoding;

    _classCallCheck(this, FileWriter);

    var flags = (append ? 'a' : 'w') + (overwrite ? '+' : 'x+');
    this.fd = fs.openSync(path, flags);
    this.encoding = encoding;
  }

  _createClass(FileWriter, [{
    key: "write",
    value: function write(data) {
      fs.appendFileSync(this.fd, data, {
        encoding: this.encoding
      });
    }
  }, {
    key: "writeLine",
    value: function writeLine(data) {
      this.write(data + EOL);
    }
  }, {
    key: "close",
    value: function close() {
      fs.closeSync(this.fd);
    }
  }]);

  return FileWriter;
}();

var FileHandler = {};

FileHandler.read = function (path, options) {
  return new LineReader(path, options);
};

FileHandler.write = function (path, options) {
  return new FileWriter(path, options);
};

FileHandler.Reader = LineReader;
FileHandler.Writer = FileWriter;

export default FileHandler;
