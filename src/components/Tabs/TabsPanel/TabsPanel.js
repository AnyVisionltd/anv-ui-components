import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './TabsPanel.module.scss'

const TabsPanel = ({ className, children, tabKey, current, ...otherProps }) => {
  if (current !== tabKey) {
    return null
  }

  const classes = classNames(styles.tabsPanel, className)

  return (
    <div className={classes} {...otherProps}>
      {children}
    </div>
  )
}

TabsPanel.propTypes = {
  /** The current active tab index */
  current: propTypes.string.isRequired,
  /** The tab key. */
  tabKey: propTypes.string.isRequired,
  /** The tab content. */
  children: propTypes.any,
  /** For css customization. */
  className: propTypes.string,
}

export default TabsPanel
