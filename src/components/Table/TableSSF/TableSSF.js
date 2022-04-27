import React, { useContext, useMemo, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import TableContext from '../TableContext'
import { SSF } from '../../../index'
import styles from './TableSSF.module.scss'

const TableSSF = ({
  onChange,
  additionalFilters,
  className,
  ...otherParams
}) => {
  const { state, setFilters } = useContext(TableContext)
  const { columns } = state

  const fields = useMemo(
    () => {
      const filtersByColumns = columns.reduce(
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
      )
      return [...filtersByColumns, ...additionalFilters]
    },
    // Don't need additionalFilters in deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns],
  )

  const handleOnChange = useCallback(
    filters => {
      if (JSON.stringify(filters) === JSON.stringify(state.filters)) return
      onChange(filters)
      setFilters(filters)
    },
    [onChange, setFilters, state.filters],
  )

  const classes = classNames(styles.TableSSF, className)

  return (
    <SSF
      className={classes}
      fields={fields}
      onChange={handleOnChange}
      {...otherParams}
    />
  )
}

TableSSF.defaultProps = {
  onChange: () => {},
  additionalFilters: [],
}

TableSSF.propTypes = {
  /** Callback fired when filters changed. */
  onChange: propTypes.func,
  /** Additional filters for the SSF:<br />
   *  <code>field</code>              - name of the value of field key that would be returned
   *                                    if the user choose this line in the menu.<br />
   *  <code>label</code>              - the name of the menu item that appears.<br />
   *  <code>type</code>               - input types.<br />
   *  <code>filterFunction</code>     - filterFunction required for self controlled table .<br />
   **/
  additionalFilters: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      label: propTypes.string.isRequired,
      type: propTypes.oneOf(['string', 'number', 'date', 'bool']),
      filterFunction: propTypes.func,
    }),
  ),
  /** For css customization. */
  className: propTypes.string,
}

export default TableSSF
