import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './index.js',
  output: [
    {
      file: 'dist/yank.mjs',
      format: 'esm',
      exports: 'default',
    },
    {
      file: 'dist/yank.cjs',
      format: 'cjs',
      exports: 'default',
      plugins: [
        getBabelOutputPlugin({
          comments: false,
          presets: [
            '@babel/env'
          ]
        })
      ]
    },
    {
      file: 'dist/yank.min.js',
      format: 'cjs',
      exports: 'default',
      plugins: [
        getBabelOutputPlugin({
          presets: [
            '@babel/env'
          ]
        }),
        terser({
          ie8: true
        })
      ]
    }
  ]
}
