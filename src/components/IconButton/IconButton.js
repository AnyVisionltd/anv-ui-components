import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import { Button } from '../Button'
import styles from './IconButton.module.scss'

const styleGuideColors = Object.keys(colors)

const IconButton = ({
  size,
  variant,
  className,
  children,
  ...buttonProps
}) => {
  const classes = classNames(
    styles.iconButton,
    styles[size],
    styles[variant],
    className,
  )

  return (
    <Button className={ classes } variant={ variant } { ...buttonProps }>
      { children }
    </Button>
  )
}

IconButton.defaultProps = {
  color: 'primary',
  size: 'small',
  variant: 'fill',
  disabled: false,
  onClick: () => {},
}

IconButton.propTypes = {
  /** The color of the button. */
  color: propTypes.oneOf(styleGuideColors),
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'large']),
  /** The variant of the button. */
  variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /** The component icon. */
  children: propTypes.node.isRequired,
}

export default IconButton
