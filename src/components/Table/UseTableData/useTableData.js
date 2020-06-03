import { useMemo, useContext, useCallback } from 'react'
import { numberSort, stringSort } from '../../../utils/sort'
import TableContext from '../TableContext'

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, selfControlled, filters, sort } = state

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
    case 'number':
      return numberSort(data, field, order)
    case 'date':
      return numberSort(data, field, order)
    default:
      return stringSort(data, field, order)
    }
  }, [sort])

  return useMemo(() => {
    let tableData = data
    if(!selfControlled) {
      return tableData
    }

    tableData = filterData(tableData)
    tableData = sortData(tableData)

    return tableData
  }, [data, selfControlled, sortData, filterData])

}

export default useTableData
