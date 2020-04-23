import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import { ReactComponent as CloseIcon } from '../../assets/svg/Cancel.svg'
import styles from './Chip.module.scss'

const styleGuideColors = Object.keys(colors)

const Chip = ({
  leadingIcon,
  className,
  color,
  trailingIcon,
  disabled,
  deletable,
  label,
  onClick,
  onTrailingIconClick,
  onKeyUp,
  onKeyDown,
  ...otherProps
}) => {
  const chipRef = React.createRef()
  const clickable = !disabled && !!onClick
  const focusable = clickable || deletable
  const classes = classNames(
    styles.chip,
    styles[color],
    styles[`chip-${color}`],
    focusable && styles.focusable,
    clickable && styles.clickable,
    disabled && styles.disabled,
    className,
  )

  const isDeleteKeyboardEvent = (event) => deletable && ['Backspace', 'Delete'].includes(event.key)

  const handleKeyDown = (event) => {
    if (event.currentTarget === event.target && isDeleteKeyboardEvent(event)) {
      event.preventDefault()
    }
    return onKeyDown && onKeyDown(event)
  }

  const handleKeyUp = (event) => {
    if (event.currentTarget === event.target) {
      if (isDeleteKeyboardEvent(event)) {
        onTrailingIconClick(event)
      } else if (event.key === 'Enter' && chipRef.current && clickable) {
        onClick(event)
      } else if (event.key === 'Escape' && chipRef.current) {
        chipRef.current.blur()
      }
    }

    return onKeyUp && onKeyUp(event)
  }

  const onClickHandler = (event) => {
    if (!clickable) {
      return
    }

    onClick(event)
    // When clicked using mouse, we would expect the chip to not be focused anymore.
    chipRef.current.blur()
  }

  const onTrailingIconClickHandler = (event) => {
    event.stopPropagation()
    // When clicked using mouse, we would expect the chip to not be focused anymore.
    chipRef.current.blur()
    return onTrailingIconClick(event)
  }

  const renderLeadingIcon = () => leadingIcon && (
    <div className={ styles.leadingIcon }>
      { leadingIcon }
    </div>
  )

  const renderTrailingIcon = () => {
    const displayedTrailingIcon = onTrailingIconClick && !trailingIcon && deletable
      ? <CloseIcon />
      : trailingIcon
    const trailingIconClasses = classNames(
      styles.trailingIcon,
      onTrailingIconClick && styles.trailingIconClickable,
    )

    if (!displayedTrailingIcon) {
      return null
    }

    return (
      <button
        className={ trailingIconClasses }
        onClick={ onTrailingIconClickHandler }
      >
        { displayedTrailingIcon }
      </button>
    )
  }

  const renderLabel = () => <span className={ styles.label }>{ label }</span>

  return (
    <div
      role="button"
      aria-disabled={ disabled ? true : undefined }
      tabIndex={ focusable ? 0 : undefined }
      className={ classes }
      onClick={ onClickHandler }
      onKeyUp={ handleKeyUp }
      onKeyDown={ handleKeyDown }
      ref={ chipRef }
      { ...otherProps }
    >
      { renderLeadingIcon() }
      { renderLabel() }
      { renderTrailingIcon() }
    </div>
  )
}

Chip.defaultProps = {
  color: 'primary',
  disabled: false,
}

Chip.propTypes = {
  /** The icon of the chip. */
  leadingIcon: propTypes.element,
  /** For css customization. */
  className: propTypes.string,
  /** The color of the chip. */
  color: propTypes.oneOf(styleGuideColors),
  /** If <code>true</code>, the chip will be disabled. */
  disabled: propTypes.bool,
  /** The label/content of the chip */
  label: propTypes.node,
  /**
   * Callback function fired when clicked.
   * Passing a function will make the chip look clickable (by hover effect, mouse pointer, etc).
   */
  onClick: propTypes.func,
  /**
   * Provide trailing icon.
   * If <code>onTrailingIconClick</code> is passed, this button will default to closeIcon,
   * unless set otherwise
   */
  trailingIcon: propTypes.element,
  /**
   * If enabled, the chip will handle backspace or delete keyboard actions by calling
   * <code>onTrailingIconClick</code> handler when focused by keyboard.
   */
  deletable: propTypes.bool,
  /**
   * Callback function when trailing icon clicked.
   * Passing a function will make a close icon to be displayed.
   */
  onTrailingIconClick: propTypes.func,
  onKeyUp: propTypes.func,
  onKeyDown: propTypes.func,
}

export default Chip
