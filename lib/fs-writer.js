import fs from 'fs'
import { EOL } from 'os'

export default class FileWriter {
  constructor (path, {
    append = false,
    overwrite = true,
    encoding = 'utf8'
  } = {}) {
    let flags = (append ? 'a' : 'w') + (overwrite ? '+' : 'x+')
    this.fd = fs.openSync(path, flags)
    this.encoding = encoding
  }

  write (data) {
    fs.appendFileSync(this.fd, data, {
      encoding: this.encoding
    })
  }

  writeLine (data) {
    this.write(data + EOL)
  }

  close () {
    fs.closeSync(this.fd)
  }
}
