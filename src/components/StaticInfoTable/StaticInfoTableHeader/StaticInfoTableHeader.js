import React from 'react'
import classNames from 'classnames'
import styles from './StaticInfoTableHeader.module.scss'

const StaticInfoTableHeader = ({ columns }) => {
  const renderCell = ({ field, content, hide, className, width }) => {
    if (hide) {
      return null
    }

    const style = width ? { width: `${width}px` } : {}

    return (
      <div
        key={field}
        role='cell'
        className={classNames(styles.headerCell, className)}
        style={style}
      >
        {typeof content === 'function' ? content() : content}
      </div>
    )
  }

  return (
    <div className={styles.staticInfoTableHeader}>
      {columns.map(renderCell)}
    </div>
  )
}

export default StaticInfoTableHeader
