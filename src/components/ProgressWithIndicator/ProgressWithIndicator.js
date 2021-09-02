import React from 'react'
import propTypes from 'prop-types'
import { ResultIndicator } from '../ResultIndicator'
import { Progress } from '../Progress'
import languageService from '../../services/language'
import styles from './ProgressWithIndicator.module.scss'

const getTranslation = word => languageService.getTranslation(word)

const ProgressWithIndicator = ({
  value,
  variant,
  className,
  tiny,
  success,
  error,
  errorMessage,
  successMessage,
  inQueue,
  ...otherProps
}) => {
  const progressProps = { value, variant, className, ...otherProps }
  const feedbackProps = {
    tiny,
    error,
    success,
    errorMessage,
    successMessage,
    inQueue,
  }
  const feedbackOptions = [error, success, inQueue].filter(Boolean)

  const progressText = (
    <h5 className={styles.progressText}>
      {!tiny && getTranslation('processing')} {value}%
    </h5>
  )

  return feedbackOptions.length ? (
    <ResultIndicator {...feedbackProps} />
  ) : (
    <>
      {progressText}
      <Progress {...progressProps} />
    </>
  )
}

ProgressWithIndicator.defaultProps = {
  className: '',
  variant: 'linear',
  value: 0,
  indeterminate: false,
}

ProgressWithIndicator.propTypes = {
  /** For css customization in progress. */
  className: propTypes.string,
  /** The progress variant. */
  variant: propTypes.oneOf(['linear', 'circle']),
  /** Progress value between - <code>0-100</code>. */
  value: propTypes.number,
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

export default ProgressWithIndicator
