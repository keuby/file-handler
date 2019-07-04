import LineReader from './lib/fs-reader'
import FileWriter from './lib/fs-writer'

const FileHandler = {}
FileHandler.read = (path, options) => new LineReader(path, options)
FileHandler.write = (path, options) => new FileWriter(path, options)
FileHandler.Reader = LineReader
FileHandler.Writer = FileWriter

export default FileHandler