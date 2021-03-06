import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { ReactComponent as CloseIcon } from '../../assets/svg/Cancel.svg'
import { useCombinedRefs } from '../../hooks/UseCombinedRefs'
import styles from './Chip.module.scss'

const Chip = React.forwardRef(
  (
    {
      leadingIcon,
      className,
      trailingIcon,
      disabled,
      deletable,
      label,
      isFocused,
      onClick,
      onTrailingIconClick,
      onKeyDown,
      ...otherProps
    },
    forwardRef,
  ) => {
    const chipRef = useCombinedRefs(forwardRef, useRef({}))
    const clickable = !disabled && !!onClick
    const focusable = clickable || deletable

    useEffect(() => {
      if (chipRef.current) {
        if (isFocused) {
          chipRef.current.focus()
        } else {
          chipRef.current.blur()
        }
      }
    }, [isFocused, chipRef])

    const isDeleteKeyboardEvent = event =>
      deletable && ['Backspace', 'Delete'].includes(event.key)

    const handleKeyDown = event => {
      if (event.currentTarget === event.target) {
        if (isDeleteKeyboardEvent(event) && onTrailingIconClick) {
          onTrailingIconClick(event)
        } else if (event.key === 'Enter' && chipRef.current && clickable) {
          onClick(event)
        } else if (event.key === 'Escape' && chipRef.current) {
          chipRef.current.blur()
        }
      }

      return onKeyDown && onKeyDown(event)
    }

    const onClickHandler = event => {
      if (!clickable) {
        return
      }

      onClick(event)
    }

    const onTrailingIconClickHandler = event => {
      if (!onTrailingIconClick) {
        return
      }
      event.stopPropagation()
      // When clicked using mouse, we would expect the chip to not be focused anymore.
      chipRef.current.blur()
      onTrailingIconClick(event)
    }

    const renderLeadingIcon = () =>
      leadingIcon && <div className={styles.leadingIcon}>{leadingIcon}</div>

    const renderTrailingIcon = () => {
      let displayedTrailingIcon = trailingIcon
      if (!displayedTrailingIcon) {
        if (onTrailingIconClick && deletable) {
          displayedTrailingIcon = <CloseIcon />
        } else {
          return null
        }
      }

      const trailingIconClasses = classNames(
        styles.trailingIcon,
        onTrailingIconClick && styles.trailingIconClickable,
      )

      return (
        <button
          className={trailingIconClasses}
          onClick={onTrailingIconClickHandler}
          disabled={disabled}
        >
          {displayedTrailingIcon}
        </button>
      )
    }

    const renderLabel = () => <span className={styles.label}>{label}</span>

    const classes = classNames(
      styles.chip,
      focusable && styles.focusable,
      clickable && styles.clickable,
      disabled && styles.disabled,
      className,
    )

    return (
      <div
        role='button'
        aria-disabled={disabled ? true : undefined}
        tabIndex={focusable ? 0 : undefined}
        className={classes}
        onClick={onClickHandler}
        onKeyDown={handleKeyDown}
        ref={chipRef}
        data-testid={'chip'}
        {...otherProps}
      >
        {renderLeadingIcon()}
        {renderLabel()}
        {renderTrailingIcon()}
      </div>
    )
  },
)

Chip.defaultProps = {
  disabled: false,
}

Chip.propTypes = {
  /** The icon of the chip. */
  leadingIcon: propTypes.element,
  /** For css customization. */
  className: propTypes.string,
  /** If <code>true</code>, the chip will be disabled. */
  disabled: propTypes.bool,
  /** The label/content of the chip */
  label: propTypes.node,
  /** Make the chip focused */
  isFocused: propTypes.bool,
  /**
   * Callback function fired when clicked.
   * Passing a function will make the chip look clickable (by hover effect, mouse pointer, focus).
   */
  onClick: propTypes.func,
  /**
   * The trailing icon for the chip.
   * If not set, <u>but</u> <code>onTrailingIconClick</code> and <code>deletable</code> are passed,
   * this button will default to closeIcon
   */
  trailingIcon: propTypes.element,
  /**
   * If enabled, the chip will handle backspace or delete keyboard actions by calling
   * <code>onTrailingIconClick</code> handler when focused.
   */
  deletable: propTypes.bool,
  /**
   * Callback function when trailing icon clicked.
   */
  onTrailingIconClick: propTypes.func,
  onKeyDown: propTypes.func,
}

export default Chip
