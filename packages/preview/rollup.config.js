import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
// @ts-ignore
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
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
        {
          src: './src/preview.css',
          dest: './dist',
          rename: () => `preview.css`,
        },
      ],
    }),
    resolve(),
    commonjs(),
    typescript({
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
    }),
    replace({ 'process.env.NODE_ENV': "'development'" }),
    // terser({
    //   mangle: false, // keep output readable for debugging, even in production
    // }),
  ],
}
