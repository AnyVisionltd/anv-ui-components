import React, { useRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Portal } from '../Portal'
import { Scale } from '../Animations/ScaleAnimation'
import { useClickOutsideListener } from '../../hooks/UseClickOutsideListener'
import styles from './Dialog.module.scss'


const Dialog = ({ isOpen, className, onClose, children, ...otherProps }) => {

  const menuWrapperRef = useRef()

  const classes = classNames(
    styles.dialog,
    className,
  )

  useClickOutsideListener(event => {
    if (!isOpen) {
      return
    }
    onClose(event)
  }, menuWrapperRef)

  return (
    <Portal containerId="dialog-container">
      { isOpen && <div className={ styles.backdrop }/> }
      <Scale isOpen={ isOpen }>
        <div className={ classes } ref={ menuWrapperRef } { ...otherProps }>
          { children }
        </div>
      </Scale>
    </Portal>
  )
}

Dialog.defaultProps = {
  isOpen: false,
  onClose: () => {}
}

Dialog.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node,
  /** Should the dialog appear on screen or not */
  isOpen: propTypes.bool.isRequired,
  /** A callback triggered whenever the menu is closed */
  onClose: propTypes.func
}

export default Dialog
