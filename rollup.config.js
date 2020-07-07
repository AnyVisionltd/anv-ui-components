import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import svgr from '@svgr/rollup'
import url from 'rollup-plugin-url'
import postcss from 'rollup-plugin-postcss'


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react',
    'react-proptypes'
  ],
  plugins: [
    resolve(),
    postcss({
      extract: true
    }),
    babel({
    }),
    url(),
    svgr({ svgo: false }),
    commonjs({
      namedExports: {
        "react-dom": ["createPortal", "findDOMNode"],
      },
    }),
  ]
}
