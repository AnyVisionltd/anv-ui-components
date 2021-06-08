import React, { Children, cloneElement, isValidElement } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { TabsItem } from './TabsItem'
import { TabsPanel } from './TabsPanel'
import styles from './Tabs.module.scss'

const Tabs = ({
  value,
  onChange,
  disabled,
  className,
  children,
  ...otherProps
}) => {
  const onSelectionChange = newValue => {
    onChange(newValue)
  }

  const childrenWithProps = () => {
    return Children.map(children, child => {
      // Checking isValidElement is the safe way and avoids a TS error too.
      if (isValidElement(child) && child.type === TabsItem) {
        const active = child.props.tabKey === value
        return cloneElement(child, {
          onChange: onSelectionChange,
          active,
          disabled: child.props.disabled || disabled,
        })
      }
      return child
    })
  }

  const classes = classNames(styles.tabs, className)

  return (
    <div className={classes} {...otherProps}>
      {childrenWithProps()}
    </div>
  )
}

Tabs.defaultProps = {
  disabled: false,
  onChange: () => {},
}

Tabs.propTypes = {
  /** Selected value. */
  value: propTypes.string.isRequired,
  /** Callback fired when selected tab changed. */
  onChange: propTypes.func.isRequired,
  /** If true disabled all items. */
  disabled: propTypes.bool,
  /** Tabs.Item elements . */
  children: propTypes.arrayOf(propTypes.element),
  /** For css customization. */
  className: propTypes.string,
}

Tabs.Item = TabsItem
Tabs.Panel = TabsPanel

export default Tabs
