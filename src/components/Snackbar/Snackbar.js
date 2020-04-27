import React, { useEffect, useCallback } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { IconButton, Portal } from '../../index'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import styles from './Snackbar.module.scss'

const Snackbar = ({
  message,
  action,
  leadingIcon,
  closeIcon,
  open,
  className,
  onOpen,
  onClose,
  hideTimeout,
}) => {
  const timerHide = React.useRef()

  const setHideTimeout = useCallback(() => {
    if (hideTimeout === null) {
      return
    }

    clearTimeout(timerHide.current)
    timerHide.current = setTimeout(() => {
      onClose()
    }, hideTimeout)
  }, [hideTimeout, onClose])

  useEffect(() => {
    if (open) {
      onOpen()
      setHideTimeout()
    }

    return () => {
      clearTimeout(timerHide.current)
    }
  }, [open, hideTimeout, setHideTimeout, onOpen])

  const renderLeadingIcon = () => {
    if (!leadingIcon) {
      return null
    }
    return (
      <span className={ styles.leadingIcon }>
        { leadingIcon }
      </span>
    )
  }

  const renderCloseIcon = () => {
    if (!closeIcon) {
      return null
    }
    return (
      <IconButton
        variant="ghost"
        className={ styles.closeIcon }
        onClick={ onClose }
      >
        { closeIcon }
      </IconButton>
    )
  }

  const classes = classNames(
    styles.snackbar,
    className,
  )

  return !open ? null : (
    <Portal
      containerId="snackbar-portal"
      className={ styles.portal }
    >
      <div
        className={ classes }
        onMouseEnter={ () => clearTimeout(timerHide.current) }
        onMouseLeave={ setHideTimeout }
      >
        <div className={ styles.messageContainer }>
          { renderLeadingIcon() }
          <span className={ styles.message }>
            { message }
          </span>
        </div>
        <div className={ styles.actionsContainer }>
          { action }
          { renderCloseIcon() }
        </div>
      </div>
    </Portal>
  )
}

Snackbar.defaultProps = {
  closeIcon: <CloseIcon />,
  onOpen: () => {},
  onClose: () => {},
  hideTimeout: 5000,
}

Snackbar.propTypes = {
  /** The message to display. */
  message: propTypes.string.isRequired,
  /**
   * The action to display. Its renders after the <code>message</code>,
   *  before <code>closeIcon</code>.
   * */
  action: propTypes.node,
  /** The icon before the <code>message</code>.  */
  leadingIcon: propTypes.element,
  /** The icon at the end of the snackbar, fire <code>onClose</code>. Set to false for remove */
  closeIcon: propTypes.oneOfType([propTypes.element, propTypes.bool]),
  /** If <code>true</code> display the snackbar. */
  open: propTypes.bool,
  /**
   * The number of milliseconds to wait before automatically calling
   * the <code>onClose</code> function.
   * Timeout pause on hover and reset by leaving the snackbar.
   * <code>onClose</code> should then set the state of the open prop to hide the Snackbar.
   * Disable this behavior by <code>null</code> value.
   * */
  hideTimeout: propTypes.number,
  /** Callback fired when the component opened. */
  onOpen: propTypes.func,
  /**
   * Callback fired when the component requests to be closed.
   * Typically onClose is used to set state in the parent component,
   * which is used to control the Snackbar open prop.
   * */
  onClose: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default Snackbar
