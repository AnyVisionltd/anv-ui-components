import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import svgr from '@svgr/rollup'
import url from 'rollup-plugin-url'
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json'


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
    json(),
    resolve(),
    postcss({
      extract: true,
      use: ['sass'],
    }),
    babel({
    }),
    url(),
    svgr({ svgo: false }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        "react-dom": ["createPortal", "findDOMNode", 'unstable_batchedUpdates'],
        'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
      },
    }),
  ]
}
