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
  isTiny,
  success,
  error,
  errorMessage,
  successMessage,
  inQueue,
  stopped,
  text,
  ...otherProps
}) => {
  const progressProps = { value, variant, className, ...otherProps }
  const feedbackProps = {
    isTiny,
    error,
    success,
    errorMessage,
    successMessage,
    inQueue,
    stopped,
  }
  const feedbackOptions = [error, success, stopped, inQueue].filter(Boolean)

  const progressText = (
    <h5 className={styles.progressText}>
      {!isTiny && text} {value}%
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
  text: getTranslation('processing'),
}

ProgressWithIndicator.propTypes = {
  /** For css customization in progress. */
  className: propTypes.string,
  /** The progress variant. */
  variant: propTypes.oneOf(['linear', 'circle']),
  /** Progress value between - <code>0-100</code>. */
  value: propTypes.number,
  /** Determines if text with `processing` or not. */
  isTiny: propTypes.bool,
  /** Determines if the action was done successfully. */
  success: propTypes.bool,
  /** Determines if the action fails. */
  error: propTypes.bool,
  /** Determines if the action stopped. */
  stopped: propTypes.bool,
  /** Message to show when action fails.*/
  errorMessage: propTypes.string,
  /** Message to show when action succeeds.*/
  successMessage: propTypes.string,
  /** Action waits to be done.*/
  inQueue: propTypes.bool,
  /** Custom text to show when action is processed, default is 'processing'. */
  text: propTypes.string,
}

export default ProgressWithIndicator
