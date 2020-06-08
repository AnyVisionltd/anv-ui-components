import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sass from 'rollup-plugin-sass'
import svg from 'rollup-plugin-svg'
import commonjs from 'rollup-plugin-commonjs'
import svgr from '@svgr/rollup'


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react',
    'react-proptypes'
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    sass({
      insert: true
    }),
    svg(),
    svgr(),
    commonjs({
      namedExports: {
        "react-dom": ["createPortal", "findDOMNode"],
      },
    }),
  ]
}
