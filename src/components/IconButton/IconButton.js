import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import { Button } from '../Button'
import styles from './IconButton.module.scss'

const styleGuideColors = Object.keys(colors)

const IconButton = ({ icon: SvgIcon, ...buttonProps }) => {
  const classes = classNames(
    styles.iconButton,
  )

  return (
    <Button className={ classes } { ...buttonProps }>
      <SvgIcon className={ styles.svgIcon } />
    </Button>
  )
}

IconButton.defaultProps = {
  color: 'primary',
  size: 'large',
  variant: 'fill',
  disabled: false,
  onClick: () => {},
  type: 'button',
}

IconButton.propTypes = {
  /** Svg icon */
  icon: propTypes.elementType.isRequired,
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
  /** Defines HTML button type attribute. */
  type: propTypes.oneOf(['button', 'reset', 'submit']),
}

export default IconButton
