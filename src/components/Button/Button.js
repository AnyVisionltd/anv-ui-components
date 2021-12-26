import React, { forwardRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import Spinner from '../Spinner'
import styles from './Button.module.scss'

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 **/

const Button = forwardRef(
  (
    {
      size,
      variant,
      leadingIcon,
      disabled,
      onClick,
      type,
      className,
      children,
      isLoading,
      ...otherProps
    },
    ref,
  ) => {
    const classes = classNames(
      styles.button,
      styles[size],
      styles[variant],
      className,
    )

    return (
      <button
        className={classes}
        onClick={onClick}
        disabled={disabled || isLoading}
        ref={ref}
        type={type}
        {...otherProps}
      >
        {leadingIcon && (
          <span className={styles.leadingIcon}>{leadingIcon}</span>
        )}
        {children}
        {isLoading && (
          <div className={styles.loading}>
            <Spinner />
          </div>
        )}
      </button>
    )
  },
)

Button.defaultProps = {
  size: 'medium',
  variant: 'fill',
  disabled: false,
  onClick: () => {},
  type: 'button',
  isLoading: false,
}

Button.propTypes = {
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'medium', 'large']),
  /** The variant of the button. */
  variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** Button type. */
  type: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
  /** The component content. */
  children: propTypes.node.isRequired,
  /** Loading indicator */
  isLoading: propTypes.bool,
}

export default Button
