import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  Hourglass,
} from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import languageService from '../../services/language'
import { ReactComponent as StopCircleOutlined } from '../../assets/svg/StopCircleOutlined.svg'
import styles from './ResultIndicator.module.scss'

const getTranslation = word => languageService.getTranslation(word)

const ResultIndicator = props => {
  const {
    isTiny,
    error,
    success,
    errorMessage,
    successMessage,
    inQueue,
    stopped,
  } = props
  // one big object map, including inqueue
  const renderInQueue = () => (
    <Tooltip content={getTranslation('inQueue')}>
      <div className={styles.inQueueContainer}>
        <Hourglass /> {!isTiny && getTranslation('inQueue')}
      </div>
    </Tooltip>
  )

  const indicatorsMap = useMemo(
    () => ({
      success: (
        <>
          <CheckCircleFilled /> {!isTiny && getTranslation('done')}
        </>
      ),
      error: (
        <>
          <TimesCircleFilled /> {!isTiny && getTranslation('failed')}
        </>
      ),
      stopped: (
        <>
          <StopCircleOutlined /> {!isTiny && getTranslation('stopped')}
        </>
      ),
    }),
    [isTiny],
  )

  const tooltipContentMap = useMemo(
    () => ({
      success: successMessage,
      error: errorMessage,
      stopped: getTranslation('stopped'),
    }),
    [errorMessage, successMessage],
  )

  const determineIndicator = obj => {
    for (let indicator in obj) {
      if (props[indicator]) return obj[indicator]
    }
  }

  const renderResult = () => {
    const classes = classNames(
      styles.resultContainer,
      success && styles.success,
      error && styles.error,
      stopped && styles.stopped,
    )

    return (
      <Tooltip content={determineIndicator(tooltipContentMap)}>
        <div className={classes}>{determineIndicator(indicatorsMap)}</div>
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
  /** Determines if the action stopped. */
  stopped: propTypes.bool,
  /** Message to show when action fails.*/
  errorMessage: propTypes.string,
  /** Message to show when action succeeds.*/
  successMessage: propTypes.string,
  /** Action waits to be done.*/
  inQueue: propTypes.bool,
}

export default ResultIndicator
