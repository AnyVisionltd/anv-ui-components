import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton } from '../../../index'
import { ReactComponent as CancelIcon } from '../../../assets/svg/Cancel.svg'
import styles from './DialogHeader.module.scss'

const DialogHeader = ({
  className,
  onClose,
  closeIcon,
  children,
  ...otherProps
}) => {
  const classes = classNames(styles.dialogHeader, className)

  return (
    <div className={classes} {...otherProps} data-testid={'dialog-header'}>
      {children}
      {closeIcon && (
        <IconButton
          variant={'ghost'}
          className={styles.closeIcon}
          onClick={onClose}
          data-testid={'dialog-header-close-icon'}
        >
          <CancelIcon />
        </IconButton>
      )}
    </div>
  )
}

DialogHeader.defaultProps = {
  onClose: () => {},
  closeIcon: true,
}

DialogHeader.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node,
  /** A callback triggered whenever the menu is closed */
  onClose: propTypes.func,
  /** Disable the close icon */
  closeIcon: propTypes.bool,
}

export default DialogHeader
