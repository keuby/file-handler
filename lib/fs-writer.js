import fs from 'fs'
import { EOL } from 'os'

export default class FileWriter {
  constructor (path, {
    cacheLines = 1000,
    append = false,
    overwrite = true,
    encoding = 'utf8'
  } = {}) {
    let flags = (append ? 'a' : 'w') + (overwrite ? '+' : 'x+')
    this.fd = fs.openSync(path, flags)
    this.encoding = encoding
    this.write = this._generaterWrite(cacheLines)
  }

  _generaterWrite (cacheLines) {
    this._cached = []
    if (cacheLines && cacheLines > 1) {
      return data => {
        if (this._cached.length >= cacheLines) {
          this.flush()
        } else {
          this._cached.push(data)
        }
      }
    } else {
      return data => {
        fs.appendFileSync(this.fd, data, {
          encoding: this.encoding
        })
      }
    }
  }

  flush () {
    if (this._cached && this._cached.length > 0) {
      fs.appendFileSync(this.fd, this._cached.join(''), {
        encoding: this.encoding
      })
      this._cached = []
    }
  }

  writeLine (data) {
    this.write(data + EOL)
  }

  close () {
    this.flush()
    fs.closeSync(this.fd)
  }
}
