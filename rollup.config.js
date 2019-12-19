import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

import pkg from './package.json'

const input = './src/index.ts'

export default {
  input,
  output: [
    {
      name: 'crisp',
      file: pkg.browser,
      format: 'umd',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
