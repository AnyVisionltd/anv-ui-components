import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Button.module.scss'

const Button = ({
  size,
  variant,
  startIcon,
  disabled,
  onClick,
  className,
  children,
  ...otherProps
}) => {
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
      { ...otherProps }
    >
      { startIcon && <span className={ styles.startIcon }>{ startIcon }</span> }
      { children }
    </button>
  )
}

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
  startIcon: propTypes.element,
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
