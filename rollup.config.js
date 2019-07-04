import pkg from './package.json'
import babel from 'rollup-plugin-babel'

export default {
  input: 'index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  external: [ 'os', 'stream', 'fs', 'util' ],
  plugins: [
    babel({
      exclude: ['node_modules/**'],
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
    })
  ]
}
