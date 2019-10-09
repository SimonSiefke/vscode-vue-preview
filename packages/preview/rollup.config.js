import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import copy from 'rollup-plugin-copy'
// @ts-ignore
import pkg from './package.json'

export default [
  {
    input: 'src/previewMain.ts',
    output: [
      {
        file: pkg.main,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      copy({
        targets: [
          {
            src: './src/vue.js',
            dest: './dist',
            rename: () => `vue.js`,
          },
        ],
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'),
        objectHashIgnoreUnknownHack: true,
      }),
      // terser({
      //   mangle: false, // keep output readable for debugging, even in production
      // }),
    ],
  },
]
