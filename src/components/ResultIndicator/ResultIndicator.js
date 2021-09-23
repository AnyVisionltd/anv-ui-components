import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  Hourglass,
  Stop,
} from '@anyvision/anv-icons'
import { Tooltip } from '../Tooltip'
import languageService from '../../services/language'
import { ReactComponent as Somestop } from '../../assets/svg/Union_94.svg'
import styles from './ResultIndicator.module.scss'

const getTranslation = word => languageService.getTranslation(word)

const ResultIndicator = props => {
  const { isTiny, errorMessage, successMessage } = props
  // one big object map, including inqueue
  // const renderInQueue = () => (
  //   <Tooltip content={getTranslation('inQueue')}>
  //     <div className={styles.inQueueContainer}>
  //       <Hourglass /> {!isTiny && getTranslation('inQueue')}
  //     </div>
  //   </Tooltip>
  // )

  const IndicatorContainer = ({ children, content, className }) => (
    <Tooltip content={content}>
      <div className={className}>{children}</div>
    </Tooltip>
  )

  const indicatorsMap = {
    inQueue: (
      <IndicatorContainer
        content={successMessage}
        className={styles.inQueueContainer}
      >
        <Hourglass /> {!isTiny && getTranslation('inQueue')}
      </IndicatorContainer>
    ),
    success: (
      <IndicatorContainer
        content={successMessage}
        className={classNames(styles.resultContainer, styles.success)}
      >
        <CheckCircleFilled /> {!isTiny && getTranslation('done')}
      </IndicatorContainer>
    ),
    error: (
      <IndicatorContainer
        content={errorMessage}
        className={classNames(styles.resultContainer, styles.error)}
      >
        <TimesCircleFilled /> {!isTiny && getTranslation('failed')}
      </IndicatorContainer>
    ),
    stopped: (
      <IndicatorContainer
        content={getTranslation('stopped')}
        className={classNames(styles.resultContainer, styles.stopped)}
      >
        <Somestop /> {!isTiny && getTranslation('stopped')}
      </IndicatorContainer>
    ),
  }

  // const tooltipContentMap = {
  //   success: successMessage,
  //   error: errorMessage,
  //   stopped: getTranslation('stopped'),
  // }

  const renderIndicator = () => {
    for (let indicator in indicatorsMap) {
      if (props[indicator]) return indicatorsMap[indicator]
    }
  }

  // const renderResult = children => {
  //   const classes = classNames(
  //     styles.resultContainer,
  //     success && styles.success,
  //     error && styles.error,
  //     stopped && styles.stopped,
  //   )

  //   return (
  //     <Tooltip content={determineIndicator(tooltipContentMap)}>
  //       <div className={classes}>{determineIndicator(indicatorsMap)}</div>
  //     </Tooltip>
  //   )
  // }

  // return inQueue ? renderInQueue() : renderResult()
  return renderIndicator()
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
