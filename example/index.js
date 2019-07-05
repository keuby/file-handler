import handler from '../index'

let reader = handler.read('example/input.txt', {
  bufferSize: 1024 * 1024, // 1M Default
  encoding: 'utf8' // Default
})
let writer = handler.write('example/output.txt', {
  cacheLines: 1000 // Cache some lines before writing to the file
})
for (let line of reader) {
  writer.writeLine(line)
}
writer.close()