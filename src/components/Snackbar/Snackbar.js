import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Button, IconButton } from '../../index'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import styles from './Snackbar.module.scss'

const Snackbar = ({
  message,
  color,
  actionText,
  leadingIcon,
  trailingIcon: TrailingIcon,
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
              color={ color }
            >
              { actionText }
            </Button>
          )
          : null }
        {
          TrailingIcon
            ? (
              <IconButton
                variant="ghost"
                color="purewhite"
                className={ styles.trailingIcon }
              >
                <TrailingIcon />
              </IconButton>
            )
            : null
        }
      </div>
    </div>
  )
}

Snackbar.defaultProps = {
  color: 'primary',
  trailingIcon: CloseIcon,
}

Snackbar.propTypes = {
  /** The message to display. */
  message: propTypes.string.isRequired,
  /** The border, leading icon and action button color. */
  color: propTypes.string,
  /** The action text. */
  actionText: propTypes.string,
  /** The icon before the message.  */
  leadingIcon: propTypes.elementType,
  /** The icon trailing icon, used for close. Set to false for remove */
  trailingIcon: propTypes.oneOfType([propTypes.elementType, propTypes.bool]),
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
