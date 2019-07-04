import handler from '../index'

export default function readFile (path) {
  let reader = handler.read(path)
  for (let _ of reader) {
    // write your code
  }
  let lines = Array.from(reader)
  if (lines.length === reader.size()) {
    console.log('test completed')
  }
}