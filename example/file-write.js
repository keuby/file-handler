import handler from '../index'

export default function readFile (path) {
  let writer = handler.write(path)
  let data = [
    'aaa',
    'bbb',
    'ccc'
  ]
  for (let line of data) {
    writer.writeLine(line)
  }
  writer.close()
}