import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import StaticInfoTableContext from './StaticInfoTableContext'
import { useStaticInfoTableReducer } from './useStaticInfoTableReducer'
import { StaticInfoTableHeader } from './StaticInfoTableHeader'
import { StaticInfoTableBody } from './StaticInfoTableBody'
import styles from './StaticInfoTable.module.scss'

const StaticInfoTable = ({ children, className }) => {
  const [state, actions] = useStaticInfoTableReducer()

  return (
    <StaticInfoTableContext.Provider value={{ state, actions }}>
      <div className={classNames(styles.staticInfoTable, className)}>
        {children}
      </div>
    </StaticInfoTableContext.Provider>
  )
}

StaticInfoTable.propTypes = {
  /** Table components */
  children: propTypes.node,
  /** For css customization. */
  className: propTypes.string,
}
StaticInfoTable.Header = StaticInfoTableHeader
StaticInfoTable.Body = StaticInfoTableBody

export default StaticInfoTable
