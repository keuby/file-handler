import LineReader from './lib/fs-reader'
import FileWriter from './lib/fs-writer'

export as namespace FileHandler

export function read(path: string, options: LineReader.LineReaderOptions): LineReader
export function write(path: string, options: FileWriter.FileWriterOptions): FileWriter
export const Reader: LineReader
export const Writer: FileWriter