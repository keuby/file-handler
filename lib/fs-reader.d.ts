export as namespace LineReader

export = LineReader

declare class LineReader implements Iterable {
  constructor(path: string, options: LineReader.LineReaderOptions)
  /**
   * 打开新文件
   * @return 若打开成功返回true, 否则返回false
   */
  open(path: string): boolean
  /**
   * 获取文件行数
   */
  size(): number
}

declare namespace LineReader {

  export interface LineReaderOptions {
    /**
     * 缓冲区大小
     */
    bufferSize: number,
    /**
     * 文本编码格式
     */
    encoding: string
  }
}