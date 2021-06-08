import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './TabsItem.module.scss'

const TabsItem = ({
  className,
  active,
  children,
  tabKey,
  leadingIcon,
  onChange,
  disabled,
  ...otherProps
}) => {
  const classes = classNames(
    styles.tabsItem,
    active && styles.active,
    disabled && styles.disabled,
    className,
  )

  return (
    <div
      className={classes}
      {...otherProps}
      onClick={() => !disabled && onChange(tabKey)}
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

TabsItem.propTypes = {
  /** The tab key. */
  tabKey: propTypes.string.isRequired,
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
}

export default TabsItem
