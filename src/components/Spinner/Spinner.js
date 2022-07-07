import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './Spinner.module.scss'

const Spinner = ({ size, color }) => {
  const classes = classNames(styles.spinner, styles[size], styles[color])

  return <div className={classes} />
}

Spinner.propTypes = {
  /** The size of the spinner.  */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'giant']),
  /** For color customization. */
  color: PropTypes.oneOf(['primary']),
}

Spinner.defaultProps = {
  size: 'small',
}

export default Spinner
