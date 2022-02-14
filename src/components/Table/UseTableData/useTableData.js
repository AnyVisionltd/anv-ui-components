import { useMemo, useContext, useCallback } from 'react'
import { numberSort, stringSort } from '../../../utils/sort'
import { types } from '../../../utils/enums'
import TableContext from '../TableContext'

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, selfControlled, filters, sort, columns } = state

  const columnsMap = useMemo(
    () =>
      columns.reduce((acc, column) => {
        acc[column.field] = column
        return acc
      }, {}),
    [columns],
  )

  const filterData = useCallback(
    data => {
      return data.filter(row => {
        return filters.every(({ field, value, filterFunction }) => {
          if (field) {
            if (columnsMap[field].filterFunction) {
              return columnsMap[field].filterFunction(row[field], value)
            }
            if (row[field]) {
              return row[field]
                .toString()
                .toLowerCase()
                .includes(value.toString().toLowerCase())
            }
            if (filterFunction) {
              return filterFunction(row)
            }
            console.warn(`There is no filter function for field: '${field}'`)
            return false
          } else {
            return Object.entries(row).some(([cellField, cellValue]) => {
              if (
                columnsMap[cellField] &&
                columnsMap[cellField].filterable !== false &&
                (columnsMap[cellField].type === types.NUMBER ||
                  columnsMap[cellField].type === types.STRING)
              ) {
                if (columnsMap[cellField].filterFunction) {
                  return columnsMap[cellField].filterFunction(cellValue, value)
                }
                return (
                  cellValue &&
                  cellValue
                    .toString()
                    .toLowerCase()
                    .includes(value.toString().toLowerCase())
                )
              }
              return false
            })
          }
        })
      })
    },
    [filters, columnsMap],
  )

  const sortData = useCallback(
    data => {
      if (!sort.sortBy.field) {
        return data
      }

      const { field, order, type } = sort.sortBy
      switch (type) {
        case 'bool':
          return numberSort(data, field, order)
        case 'number':
          return numberSort(data, field, order)
        case 'date':
          return numberSort(data, field, order)
        default:
          return stringSort(data, field, order)
      }
    },
    [sort],
  )

  return useMemo(() => {
    let tableData = data
    if (!selfControlled) {
      return tableData
    }

    tableData = filterData(tableData)
    tableData = sortData(tableData)

    return tableData
  }, [data, selfControlled, sortData, filterData])
}

export default useTableData
