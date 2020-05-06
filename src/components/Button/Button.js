import React, { forwardRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Button.module.scss'

const Button = forwardRef(({
  size,
  variant,
  leadingIcon,
  disabled,
  onClick,
  className,
  children,
  ...otherProps
}, ref) => {
  const classes = classNames(
    styles.button,
    styles[size],
    styles[variant],
    className,
  )

  return (
    <button
      className={ classes }
      onClick={ onClick }
      disabled={ disabled }
      ref={ ref }
      { ...otherProps }
    >
      { leadingIcon && <span className={ styles.leadingIcon }>{ leadingIcon }</span> }
      { children }
    </button>
  )
})

Button.defaultProps = {
  size: 'large',
  variant: 'fill',
  disabled: false,
  onClick: () => {},
}

Button.propTypes = {
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'large']),
  /** The variant of the button. */
  variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /** The component content. */
  children: propTypes.node.isRequired,
}

export default Button
