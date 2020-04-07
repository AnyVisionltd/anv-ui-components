import React from 'react'
import propTypes from 'prop-types'
import styles from './Example.module.scss'

const Example = ({ extraText, className }) => (
  <h1 className={ `${ className } ${ styles.justSomeClass }` }>
    Hello World
    <p>{ extraText }</p>
  </h1>
)

// The comments use for storybook props table
Example.propTypes = {
  /** Custom class */
  className: propTypes.string,
  /** Add text to the component */
  extraText: propTypes.string,
}

export default Example
