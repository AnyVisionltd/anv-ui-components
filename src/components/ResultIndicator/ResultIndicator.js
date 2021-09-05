import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  Hourglass,
} from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import languageService from '../../services/language'
import styles from './ResultIndicator.module.scss'

const getTranslation = word => languageService.getTranslation(word)

const ResultIndicator = ({
  isTiny,
  error,
  success,
  errorMessage,
  successMessage,
  inQueue,
}) => {
  const renderInQueue = () => (
    <Tooltip content={getTranslation('inQueue')}>
      <div className={styles.inQueueContainer}>
        <Hourglass /> {!isTiny && getTranslation('inQueue')}
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
              <CheckCircleFilled /> {!isTiny && getTranslation('done')}
            </>
          ) : (
            <>
              <TimesCircleFilled /> {!isTiny && getTranslation('failed')}
            </>
          )}
        </div>
      </Tooltip>
    )
  }

  return inQueue ? renderInQueue() : renderResult()
}

ResultIndicator.defaultProps = {
  className: '',
  successMessage: getTranslation('completed'),
  errorMessage: getTranslation('failed'),
}

ResultIndicator.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** Determines if text with `processing` or not. */
  isTiny: propTypes.bool,
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

export default ResultIndicator
