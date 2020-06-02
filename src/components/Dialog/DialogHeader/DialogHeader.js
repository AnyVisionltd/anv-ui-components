import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton } from '../../IconButton'
import { ReactComponent as CancelIcon } from '../../../assets/svg/Cancel.svg'
import styles from './DialogHeader.module.scss'

const DialogHeader = ({ className, onClose, children, ...otherProps }) => {

  const classes = classNames(
    styles.dialogHeader,
    className,
  )

  return (
    <div className={ classes } { ...otherProps } data-testid={ 'dialog-header' }>
      { children }
      { onClose
        ? (
        <IconButton variant={ 'ghost' } onClick={ onClose }>
          <CancelIcon />
        </IconButton>
      )
        : null }
    </div>
  )
}

DialogHeader.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node,
  /** Should the dialog appear on screen or not */
  onClose: propTypes.func
}

export default DialogHeader
