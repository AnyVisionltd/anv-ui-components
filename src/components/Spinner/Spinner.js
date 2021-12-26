import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './Spinner.module.scss'

const Spinner = ({ size }) => (
  <div className={classNames(styles.spinner, styles[size])} />
)

Spinner.propTypes = {
  /** The size of the spinner. */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'giant']),
}

Spinner.defaultProps = {
  size: 'small',
}

export default Spinner
