import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Dialog, Button } from '../../index'
import { IconButton } from '../../index'
import { ReactComponent as BackIcon } from '../../assets/svg/LongArrow.svg'
import languageService from '../../services/language'
import styles from './DialogWizard.module.scss'

const DialogWizard = ({
  className,
  onClose,
  onNextClick,
  isDialogOpen,
  headerTitle,
  footerMessage,
  steps,
  currentStep,
  overlayContent,
  overlayClassName,
  finishText,
  nextText,
  cancelText,
  ...otherProps
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
      return onClose()
    }
    onNextClick(nextStep)
  }

  const renderSteps = () => {
    return (
      <div className={ styles.steps }>
        <small>{ languageService.getTranslation('step') }</small>
        <div className={ styles.stepsNumbers }>
          <small>{ step }</small>
          <small>-</small>
          <small>{ steps.length }</small>
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
        variant={ 'ghost' }
        onClick={ onBack }
        className={ styles.backButton }
        data-testid={ 'back-button' }
      >
        <BackIcon />
      </IconButton>
    )
  }

  const handleClose = () => {
    if(!currentStep) {
      setStep(1)
    }
    onClose()
  }

  return (
    <Dialog
      className={ className }
      isOpen={ isDialogOpen }
      onClose={ handleClose }
      { ...otherProps }
    >
      <Dialog.Header >
        <div className={ styles.header }>
          <div className={ styles.headerLeftSide }>
            { renderBackIcon() }
            { headerTitle }
          </div>
          { renderSteps() }
        </div>
      </Dialog.Header>
      <div className={ styles.progress }>
        <div className={ styles.innerProgress } style={ { width: `${(step / steps.length) * 100}%` } } />
      </div>
      <div className={ styles.content }>
        <Dialog.Body >
          { steps.length && steps[step - 1] }
        </Dialog.Body>
        <Dialog.Footer>
          <div className={ styles.footer }>
            { footerMessage }
            <div className={ styles.buttons }>
              <Button variant={ 'ghost' } onClick={ handleClose }>
                { cancelText }
              </Button>
              <Button onClick={ handleNextClick }>
                { step === steps.length ? finishText : nextText }
              </Button>
            </div>
          </div>
        </Dialog.Footer>
        { overlayContent && <div className={ classNames(styles.overlay, overlayClassName) }>
          { overlayContent }
        </div> }
      </div>
    </Dialog>
  )
}

DialogWizard.defaultProps = {
  isOpen: false,
  onClose: () => { },
  onNextClick: () => { },
  disableBackdropClick: false,
  disableEscapeKeyDown: false,
  steps: [],
  cancelText: languageService.getTranslation('cancel'),
  nextText: languageService.getTranslation('next'),
  finishText: languageService.getTranslation('finish'),
}

DialogWizard.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Should the dialog appear on screen or not */
  isOpen: propTypes.bool.isRequired,
  /** A callback triggered whenever the wizard is closed */
  onClose: propTypes.func,
  /** Disable onClose firing when backdrop is clicked */
  disableBackdropClick: propTypes.bool,
  /** Disable onClose firing when escape button is clicked */
  disableEscapeKeyDown: propTypes.bool,
  /** footer meesage can be a string or an element */
  footerMessage: propTypes.oneOfType([propTypes.string, propTypes.element]),
  /** header title can be a string or an element */
  headerTitle: propTypes.oneOfType([propTypes.string, propTypes.element]),
  /** array of steps*/
  steps: propTypes.arrayOf(propTypes.element),
  /** current step, default is 1, if step is not provided the wizard is self controlled*/
  currentStep: propTypes.number,
  /** overlay content element*/
  overlayContent: propTypes.element,
  /** css costumization for ovarlay */
  overlayClassName: propTypes.string,
  /** text for done button */
  finishText: propTypes.string,
  /** text for next button */
  nextText: propTypes.string,
  /** text for cancel button */
  cancelText: propTypes.string,
}

export default DialogWizard