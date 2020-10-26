import React, { useContext, useMemo, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import TableContext from '../TableContext'
import { SSF } from '../../../index'
import styles from './TableSSF.module.scss'

const TableSSF = ({ onChange, className }) => {
  const { state, setFilters } = useContext(TableContext)
  const { columns } = state

  const fields = useMemo(
    () =>
      columns.reduce(
        (acc, { hide, filterable = true, field, label, content, type }) => {
          if (!hide && filterable) {
            acc.push({
              field: field,
              label: label || content,
              ...(type && { type }),
            })
          }
          return acc
        },
        [],
      ),
    [columns],
  )

  const handleOnChange = useCallback(
    filters => {
      onChange(filters)
      setFilters(filters)
    },
    [onChange, setFilters],
  )

  const classes = classNames(styles.TableSSF, className)

  return <SSF className={classes} fields={fields} onChange={handleOnChange} />
}

TableSSF.defaultProps = {
  onChange: () => {},
}

TableSSF.propTypes = {
  /** Callback fired when filters changed. */
  onChange: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default TableSSF
