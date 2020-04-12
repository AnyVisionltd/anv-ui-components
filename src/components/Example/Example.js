import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Example.module.scss'

const Example = ({ show, text, className }) => (
  <div>
    { show
      ? (
        <h4 className={ classNames(className, styles.justSomeClass) }>
          <p>{ text }</p>
        </h4>
      )
      : null }
  </div>
)

Example.defaultProps = {
  show: true,
}

// The comments use for storybook props table
Example.propTypes = {
  /** Show or hide the component */
  show: propTypes.bool,
  /** Custom class */
  className: propTypes.string,
  /** Add text to the component */
  text: propTypes.string.isRequired,
}

export default Example
