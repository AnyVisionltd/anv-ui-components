import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Progress.module.scss'

const Progress = ({ value, variant, className, ...otherProps }) => {
  const [circleRef, setCircleRef] = useState()

  const renderCircle = () => {
    const height =
      circleRef && circleRef.offsetHeight ? circleRef.offsetHeight : 48

    let strokeDashoffset
    const radius = height / 2
    const strokeWidth = 4
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    if (value >= 0) {
      const progress = value <= 100 ? value : 100
      strokeDashoffset = circumference - (progress / 100) * circumference
    }

    const classes = classNames(
      styles.circleProgress,
      value === undefined && styles.indeterminate,
    )

    return (
      <svg ref={setCircleRef} className={classes}>
        <circle
          className={styles.circleBar}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    )
  }

  const renderLine = () => {
    const classes = classNames(styles.lineProgress, className)

    const barClasses = classNames(
      styles.bar,
      value === undefined && styles.indeterminate,
    )

    let width = {}
    if (value >= 0) {
      width = { width: `${value}%` }
    }
    return (
      <div className={classes} {...otherProps}>
        <div className={barClasses} style={width} />
      </div>
    )
  }

  return variant === 'linear' ? renderLine() : renderCircle()
}

Progress.defaultProps = {
  className: false,
  variant: 'linear',
}

Progress.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** For css customization. */
  variant: propTypes.oneOf(['linear', 'circle']),
  /** For css customization. */
  value: propTypes.number,
}

export default Progress
