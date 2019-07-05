import fs from 'fs'

const cached = {}

export default class LineReader {
  constructor (path, {
    bufferSize = 1024 * 1024,
    encoding = 'utf8'
  } = {}) {
    this._bufferSize = bufferSize
    this._encoding = encoding
    this.fstat = this.fpath = null
    if (!(path && this.open(path))) {
      throw new Error(path + ' is not a file')
    }
  }

  open (path) {
    this.fstat = fs.statSync(path)
    return this.fstat.isFile && !!(this.fpath = path)
  }

  size () {
    if (cached[this.fstat.mtimeMs]) {
      return cached[this.fstat.mtimeMs]
    }
    let count = 0
    for (let _ of this) count++
    return cached[this.fstat.mtimeMs] = count
  }

  [Symbol.iterator] () {
    let buffer = Buffer.alloc(this._bufferSize)
    let fd = fs.openSync(this.fpath, 'r')
    let remaining = ''
  
    let next = () => {
      if (fd === 0) {
        return { value: undefined, done: true }
      }
      let lineBreak
      while((lineBreak = remaining.match(/\r?\n/)) === null) {
        let bytesReadNum = fs.readSync(fd, buffer, 0, buffer.byteLength, null)
        if (bytesReadNum !== 0) {
          remaining += buffer.toString(this._encoding, 0, bytesReadNum)
        } else {
          fs.closeSync(fd)
          fd = 0
          return { value: remaining, done: false }
        }
      }
      let line = remaining.substring(0, lineBreak.index)
      remaining = remaining.substring(lineBreak.index + lineBreak[0].length)
      return { value: line, done: false }
    }

    return { next }
  }
}
