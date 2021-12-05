import React, { useEffect, useCallback, useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { TimesThick } from '@anyvision/anv-icons'
import languageService from '../../services/language'
import { IconButton, Portal, Animations, Button } from '../../index'
import toastMessageTypeMapper from './ToastMessage.utils'
import styles from './ToastMessage.module.scss'

const ToastMessage = ({ message, type, isUndo, undoCallback, closeIcon, isOpen, className, onClose, hideTimeout }) => {
  const timerHide = useRef()

  const setHideTimeout = useCallback(() => {
    if (!hideTimeout) {
      return
    }

    clearTimeout(timerHide.current)
    timerHide.current = setTimeout(() => {
      onClose()
    }, hideTimeout)
  }, [hideTimeout, onClose])

  useEffect(() => {
    if (isOpen) {
      setHideTimeout()
    }

    return () => {
      clearTimeout(timerHide.current)
    }
  }, [isOpen, hideTimeout, setHideTimeout])


  const toastMessageTheme = toastMessageTypeMapper(type)

  const renderLeadingIcon = () => (
    <span className={classNames(styles.leadingIcon, toastMessageTheme.fillColor)}>
      {toastMessageTheme.icon}
    </span>
  )

  const renderCloseIcon = () => {
    if (!closeIcon) {
      return null
    }
    return (
      <IconButton
        variant='ghost'
        className={styles.closeIcon}
        onClick={onClose}
      >
        {closeIcon}
      </IconButton>
    )
  }

  const renderUndoButton = () =>
      isUndo &&
      <Button className={styles.undoButton} onClick={undoCallback} variant='ghost'
              size='small'>{ languageService.getTranslation('undo') }</Button>

  const classes = classNames(styles.toastMessage, className, {
    [styles[type]]: !!type,
  })

  return (
    <Animations.Slide isOpen={isOpen}>
      <Portal containerId='toastMessage-portal' className={styles.portal}>
        <div className={classes} onMouseEnter={() => clearTimeout(timerHide.current)}
             onMouseLeave={setHideTimeout}>
          <div className={styles.messageContainer}>
            {renderLeadingIcon()}
            <span>{message}</span>
          </div>
          <div className={styles.actionsContainer}>
            {renderUndoButton()}
            {renderCloseIcon()}
          </div>
        </div>
      </Portal>
    </Animations.Slide>
  )
}

ToastMessage.defaultProps = {
  type: 'info',
  isUndo: false,
  closeIcon: <TimesThick />,
  onClose: () => {},
  hideTimeout: 5000,
}

ToastMessage.propTypes = {
  /** The message to display. */
  message: propTypes.string.isRequired,
  /** The type of Toast Message to display. */
  type: propTypes.oneOf(['success', 'info', 'error', 'alert']),
  /** If <code>true</code> display the undo button. */
  isUndo: propTypes.bool,
  /** Callback fired when the user clicks the undo button. */
  undoCallback: propTypes.func,
  /** The icon at the end of the Toast Message, fire <code>onClose</code>. Set to false for remove. */
  closeIcon: propTypes.oneOfType([propTypes.element, propTypes.bool]),
  /** If <code>true</code> display the snackbar. */
  isOpen: propTypes.bool,
  /**
   * Callback fired when the component requests to be closed.
   * Typically onClose is used to set state in the parent component,
   * which is used to control the ToastMessage <code>open</code> prop.
   * */
  onClose: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /**
   * The number of milliseconds to wait before automatically calling
   * the <code>onClose</code> function.
   * Timeout pause on hover and reset by leaving the snackbar.
   * <code>onClose</code> should then set the state of the
   * <code>isOpen</code> prop to hide the Snackbar.g
   * Disable this behavior by <code>null</code> value.
   * */
  hideTimeout: propTypes.number,
}

export default ToastMessage
