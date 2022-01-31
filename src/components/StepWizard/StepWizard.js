import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { IconButton, Button, Dialog } from '../../index'
import { ReactComponent as BackIcon } from '../../assets/svg/LongArrow.svg'
import languageService from '../../services/language'
import styles from './StepWizard.module.scss'

const StepWizard = ({
  className,
  onNextClick,
  headerTitle,
  footerMessage,
  steps,
  currentStep,
  finishText,
  nextText,
  disabled,
  banner,
  onFinish,
  classes,
}) => {
  const [step, setStep] = useState(currentStep || 1)

  useEffect(() => {
    if (currentStep) {
      setStep(currentStep)
    }
  }, [currentStep])

  const handleNextClick = () => {
    let nextStep = Math.min(step + 1, steps.length)
    if (!currentStep) {
      setStep(step === steps.length ? 1 : nextStep)
    }
    if (step === steps.length) {
      return onFinish()
    }
    onNextClick(nextStep)
  }

  const renderSteps = () => {
    return (
      <div className={styles.steps}>
        <small>{languageService.getTranslation('step')}</small>
        <div className={styles.stepsNumbers}>
          <small className={styles.stepNumber}>{step}</small>
          <small>{languageService.getTranslation('stepOutOf')}</small>
          <small className={styles.stepNumber}>{steps.length}</small>
        </div>
      </div>
    )
  }

  const onBack = () => {
    let nextStep = Math.max(step - 1, 1)
    if (!currentStep) {
      setStep(nextStep)
    }
    onNextClick(nextStep)
  }

  const renderBackIcon = () => {
    if (step === 1) {
      return null
    }

    return (
      <IconButton
        variant={'ghost'}
        onClick={onBack}
        className={styles.backButton}
        data-testid={'back-button'}
      >
        <BackIcon />
      </IconButton>
    )
  }

  return (
    <div className={classNames(styles.stepWizardContainer, className)}>
      <StepWizard.Header className={classes.header} closeIcon={false}>
        <div className={styles.header}>
          <div className={styles.headerLeftSide}>
            {renderBackIcon()}
            {headerTitle}
          </div>
          {renderSteps()}
        </div>
      </StepWizard.Header>
      <div className={styles.progress}>
        <div
          className={styles.innerProgress}
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
      {banner}
      <div className={styles.content}>
        <StepWizard.Body className={classes.body}>{steps.length && steps[step - 1]}</StepWizard.Body>
        <StepWizard.Footer className={classes.footer}>
          <div className={styles.footer}>
            {footerMessage}
            <div className={styles.buttons}>
              <Button onClick={handleNextClick} disabled={disabled}>
                {step === steps.length ? finishText : nextText}
              </Button>
            </div>
          </div>
        </StepWizard.Footer>
      </div>
    </div>
  )
}

StepWizard.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onFinish: () => {},
  onNextClick: () => {},
  disableBackdropClick: false,
  steps: [],
  cancelText: languageService.getTranslation('cancel'),
  nextText: languageService.getTranslation('next'),
  finishText: languageService.getTranslation('finish'),
  disabled: false,
  classes: {},
}

StepWizard.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** A callback triggered whenever the wizard is finished */
  onFinish: propTypes.func,
  /** footer message can be a string or an element */
  footerMessage: propTypes.oneOfType([propTypes.string, propTypes.element]),
  /** header title can be a string or an element */
  headerTitle: propTypes.oneOfType([propTypes.string, propTypes.element]),
  /** array of steps*/
  steps: propTypes.arrayOf(propTypes.element),
  /** current step, default is 1, if step is not provided the wizard is self controlled*/
  currentStep: propTypes.number,
  /** text for done button */
  finishText: propTypes.string,
  /** text for next button */
  nextText: propTypes.string,
  /** text for cancel button, if text is null button will be hidden */
  cancelText: propTypes.string,
  /** boolean to disable next/finish button */
  disabled: propTypes.bool,
  /** banner component to be rendered */
  banner: propTypes.element,
  /** styles object for various parts of the component */
  classes: propTypes.shape({
    header: propTypes.string,
    body: propTypes.string,
    footer: propTypes.string,
  }),
}

const { Header, Body, Footer } = Dialog || {}

StepWizard.Header = Header
StepWizard.Body = Body
StepWizard.Footer = Footer

export default StepWizard
