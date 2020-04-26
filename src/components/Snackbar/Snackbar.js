import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Button, IconButton } from '../../index'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import styles from './Snackbar.module.scss'

const Snackbar = ({
  message,
  actionText,
  leadingIcon,
  trailingIcon,
  open,
  className,
}) => {
  const classes = classNames(
    styles.snackbar,
    open && styles.isOpen,
    className,
  )

  return (
    <div className={ classes }>
      <div className={ styles.messageContainer }>
        {
          leadingIcon
            ? (
              <span className={ styles.leadingIcon }>
                { leadingIcon }
              </span>
            )
            : null
        }
        <span className={ styles.message }>
          { message }
        </span>
      </div>
      <div className={ styles.actionsContainer }>
        { actionText
          ? (
            <Button
              variant="ghost"
              size="small"
              className={ styles.actionButton }
            >
              { actionText }
            </Button>
          )
          : null }
        {
          trailingIcon
            ? (
              <IconButton
                variant="ghost"
                color="purewhite"
                className={ styles.trailingIcon }
              >
                { trailingIcon }
              </IconButton>
            )
            : null
        }
      </div>
    </div>
  )
}

Snackbar.defaultProps = {
  trailingIcon: <CloseIcon />,
}

Snackbar.propTypes = {
  /** The message to display. */
  message: propTypes.string.isRequired,
  /** The action text. */
  actionText: propTypes.string,
  /** The icon before the message.  */
  leadingIcon: propTypes.element,
  /** The icon trailing icon, used for close. Set to false for remove */
  trailingIcon: propTypes.oneOfType([propTypes.element, propTypes.bool]),
  /** If true display the snackbar. */
  open: propTypes.bool,
  // /** Callback fired when the component opened. */
  // onOpen: propTypes.bool,
  // /** Callback fired when the component closed. */
  // onClose: propTypes.bool,
  // /** Callback fired when action click. */
  // onAction: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
}

export default Snackbar
