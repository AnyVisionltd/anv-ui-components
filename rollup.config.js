import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import svgr from '@svgr/rollup'
import url from 'rollup-plugin-url'
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json'

export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
  },
  // All the used libs needs to be here
  external: ['react', 'react-proptypes'],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    json(),
    resolve(),
    postcss({
      extract: true,
      use: ['sass'],
    }),
    babel({ extensions: ['.ts', '.tsx', '.js', 'jsx'], include: ['src/**/*'] }),
    url(),
    svgr({ svgo: false }),
    commonjs(),
  ],
}
