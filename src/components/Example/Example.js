import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Example.module.scss'

const Example = ({ show, text, className }) => (
  <div>
    { show
      ? (
        <h1 className={ classNames(className, styles.justSomeClass) }>
          <p>{ text }</p>
        </h1>
      )
      : null }
  </div>
)

Example.defaultProps = {
  text: 'Hello Word',
}

// The comments use for storybook props table
Example.propTypes = {
  /** Show or hide the component */
  show: propTypes.bool.isRequired,
  /** Custom class */
  className: propTypes.string,
  /** Add text to the component */
  text: propTypes.string,
}

export default Example
