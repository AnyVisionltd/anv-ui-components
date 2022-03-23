import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import {
  CheckCircleFilled,
  TimesCircleFilled,
  Hourglass,
  Stop,
} from '@anyvision/anv-icons'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import { Tooltip } from '../Tooltip'
import styles from './ResultIndicator.module.scss'

const IndicatorContainer = ({ children, content, className }) => (
  <Tooltip content={content}>
    <div className={className}>{children}</div>
  </Tooltip>
)

const ResultIndicator = props => {
  const { getComponentTranslation } = useComponentTranslation()
  const ResultIndicatorTranslations = getComponentTranslation(
    'resultsIndicator',
  )

  const { isTiny, errorMessage, successMessage } = props

  const indicatorsMap = useMemo(
    () => ({
      inQueue: (
        <IndicatorContainer
          content={ResultIndicatorTranslations.inQueue}
          className={styles.inQueueContainer}
        >
          <Hourglass /> {!isTiny && ResultIndicatorTranslations.inQueue}
        </IndicatorContainer>
      ),
      success: (
        <IndicatorContainer
          content={successMessage || ResultIndicatorTranslations.done}
          className={classNames(styles.resultContainer, styles.success)}
        >
          <CheckCircleFilled /> {!isTiny && ResultIndicatorTranslations.done}
        </IndicatorContainer>
      ),
      error: (
        <IndicatorContainer
          content={errorMessage || ResultIndicatorTranslations.failed}
          className={classNames(styles.resultContainer, styles.error)}
        >
          <TimesCircleFilled /> {!isTiny && ResultIndicatorTranslations.failed}
        </IndicatorContainer>
      ),
      stopped: (
        <IndicatorContainer
          content={ResultIndicatorTranslations.stopped}
          className={classNames(styles.resultContainer, styles.stopped)}
        >
          <Stop /> {!isTiny && ResultIndicatorTranslations.stopped}
        </IndicatorContainer>
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errorMessage, isTiny, successMessage],
  )

  const renderIndicator = () => {
    for (let indicator in indicatorsMap) {
      if (props[indicator]) return indicatorsMap[indicator]
    }
    return null
  }

  return renderIndicator()
}

ResultIndicator.defaultProps = {
  className: '',
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
