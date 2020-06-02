import { useMemo, useContext, useCallback } from 'react'
import { numberSort, stringSort } from '../../../utils/sort'
import TableContext from '../TableContext'

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, controlled, filters, sort } = state

  const filterData = useCallback(data => {
    return data.filter(row => {
      return filters.every(({ field, value }) => {
        if(field) {
          return row[field].toString().toLowerCase().includes(value)
        } else {
          return Object.values(row).some(cellValue => cellValue.toString().toLowerCase().includes(value))
        }
      })
    })
  }, [filters])

  const sortData = useCallback(data => {
    if(!sort.sortBy.field) {
      return data
    }

    const { field, order, type } = sort.sortBy
    switch(type) {
    case 'text':
      return stringSort(data, field, order)
    default:
      return numberSort(data, field, order)
    }
  }, [sort])

  return useMemo(() => {
    let tableData = data
    if(controlled) {
      return tableData
    }

    tableData = filterData(tableData)
    tableData = sortData(tableData)

    return tableData
  }, [data, controlled, sortData, filterData])

}

export default useTableData
