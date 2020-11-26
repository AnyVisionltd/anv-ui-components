import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './SelectionGroupItem.module.scss'

const SelectionGroupItem = ({
  className,
  variant,
  active,
  children,
  value,
  leadingIcon,
  onChange,
  disabled,
  leastOneActive,
  ...otherProps
}) => {
  const classes = classNames(
    leastOneActive && styles.leastOneActive,
    styles.selectionGroupItem,
    styles[variant],
    active && styles.active,
    disabled && styles.disabled,
    className,
  )

  return (
    <div
      className={classes}
      {...otherProps}
      onClick={() => !disabled && onChange(value)}
    >
      <div>
        {leadingIcon && (
          <span className={styles.leadingIcon}>{leadingIcon}</span>
        )}
        {children}
      </div>
    </div>
  )
}

SelectionGroupItem.propTypes = {
  /** The item value. */
  value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  /** Icon before the value. */
  leadingIcon: propTypes.any,
  /** The item content. */
  children: propTypes.any,
  /** If true disabled the item. */
  disabled: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** @ignore */
  active: propTypes.bool,
  /** @ignore */
  onClick: propTypes.func,
  /** @ignore */
  withIsActive: propTypes.bool,
  /** @ignore */
  variant: propTypes.oneOf(['sharp', 'round', 'ghost']),
  /** @ignore */
  leastOneActive: propTypes.bool,
}

export default SelectionGroupItem
