import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  Hourglass,
} from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import languageService from '../../services/language'
import styles from './Progress.module.scss'

const getTranslation = word => languageService.getTranslation(word)

const Progress = ({
  value,
  variant,
  indeterminate,
  className,
  withText,
  tiny,
  success,
  error,
  errorMessage,
  successMessage,
  inQueue,
  ...otherProps
}) => {
  const [circleRef, setCircleRef] = useState()

  const renderInQueue = () => (
    <Tooltip content={getTranslation('inQueue')}>
      <div className={styles.inQueueContainer}>
        <Hourglass /> {!tiny && getTranslation('inQueue')}
      </div>
    </Tooltip>
  )

  const renderResult = () => {
    const classes = classNames(
      styles.resultContainer,
      success && styles.success,
      error && styles.error,
    )

    return (
      <Tooltip content={success ? successMessage : errorMessage}>
        <div className={classes}>
          {success ? (
            <>
              <CheckCircleFilled /> {!tiny && getTranslation('done')}
            </>
          ) : (
            <>
              <TimesCircleFilled /> {!tiny && getTranslation('failed')}
            </>
          )}
        </div>
      </Tooltip>
    )
  }

  const progressText = withText && !indeterminate && (
    <h5 className={styles.progressText}>
      {!tiny && getTranslation('processing')} {value}%
    </h5>
  )

  const renderProgressCircle = () => {
    if (success || error) return renderResult()
    const classes = classNames(
      styles.circleProgress,
      indeterminate && styles.indeterminate,
    )

    const renderCircle = () => {
      if (!circleRef) return
      const height = circleRef.clientHeight
      let strokeDashoffset, progress
      const radius = height / 2
      const strokeWidth = 4
      const normalizedRadius = radius - strokeWidth * 2
      const circumference = normalizedRadius * 2 * Math.PI
      if (indeterminate) {
        progress = 25
      } else {
        progress = value <= 100 ? value : 100
      }
      strokeDashoffset = circumference - (progress / 100) * circumference
      return (
        <circle
          className={styles.circleBar}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      )
    }

    return (
      <>
        {progressText}
        <svg ref={setCircleRef} className={classes}>
          {renderCircle()}
        </svg>
      </>
    )
  }

  const renderProgressLine = () => {
    if (success || error) return renderResult()
    const classes = classNames(styles.lineProgress, className)

    const barClasses = classNames(
      styles.lineBar,
      indeterminate && styles.indeterminate,
    )

    let width = {}
    if (value >= 0) {
      width = { width: `${value}%` }
    }
    return (
      <>
        {progressText}
        <div className={classes} {...otherProps}>
          <div className={barClasses} style={width} />
        </div>
      </>
    )
  }

  const variantsRender = {
    linear: renderProgressLine,
    circle: renderProgressCircle,
  }

  return inQueue ? renderInQueue() : variantsRender[variant]()
}

Progress.defaultProps = {
  className: '',
  variant: 'linear',
  value: 0,
  indeterminate: false,
  successMessage: getTranslation('completed'),
  errorMessage: getTranslation('failed'),
  inQueue: false,
}

Progress.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** The progress variant. */
  variant: propTypes.oneOf(['linear', 'circle']),
  /** Progress value between - <code>0-100</code>. */
  value: propTypes.number,
  /** Indeterminate mode. */
  indeterminate: propTypes.bool,
  /** With text above progress. For use with min-width 150px, otherwise using tiny prop. */
  withText: propTypes.bool,
  /** Determines if text with `processing` or not. */
  tiny: propTypes.bool,
  /** Determines if the action was done successfully. */
  success: propTypes.bool,
  /** Determines if the action fails. */
  error: propTypes.bool,
  /** Message to show when action fails.*/
  errorMessage: propTypes.string,
  /** Message to show when action succeeds.*/
  successMessage: propTypes.string,
  /** Action waits to be done.*/
  inQueue: propTypes.bool,
}

export default Progress
