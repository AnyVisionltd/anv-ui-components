import React, { useEffect, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton, Portal, Animations } from '../../index'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import styles from './ToastMessage.module.scss'
import toastMessageTypeMapper from './helper'

const ToastMessage = ({ message, type, isUndo, undoCallback, closeIcon, isOpen, className, onClose }) => {

  // const timerHide = React.useRef()
  //
  // const setHideTimeout = useCallback(() => {
  //   if (hideTimeout === null) {
  //     return
  //   }
  //
  //   clearTimeout(timerHide.current)
  //   timerHide.current = setTimeout(() => {
  //     onClose()
  //   }, hideTimeout)
  // }, [hideTimeout, onClose])

  // useEffect(() => {
  //   if (isOpen) {
  //     onOpen()
  //     // setHideTimeout()
  //   }
  //
  //   return () => {
  //     clearTimeout(timerHide.current)
  //   }
  // }, [isOpen, hideTimeout, setHideTimeout, onOpen])

  const toastMessageTheme = toastMessageTypeMapper(type)

  const renderLeadingIcon = () => <span
    className={classNames(styles.leadingIcon, toastMessageTheme.fillColor)}>{toastMessageTheme.icon}</span>

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

  const classes = classNames(styles.toastMessage, className, { [styles[type]]: !!type })

  return (
    <Animations.Slide isOpen={isOpen}>
      <Portal containerId='toastMessage-portal' className={styles.portal}>
        <div className={classes}>
          <div className={styles.messageContainer}>
            {renderLeadingIcon()}
            <span>{message}</span>
          </div>
          <div className={styles.actionsContainer}>
            {/*{action}*/}
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
  closeIcon: <CloseIcon />,
  onClose: () => {
  },
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
}

export default ToastMessage
