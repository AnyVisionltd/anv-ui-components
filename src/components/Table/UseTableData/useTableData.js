import { useMemo, useContext, useCallback } from 'react'
import { numberSort, stringSort } from '../../../utils/sort'
import TableContext from '../TableContext'

export const getFilteredData = (data, filters) => {
  return data.filter(row => {
    return filters.every(({ field, value }) => {
      if(field) {
        return row[field].toString().toLowerCase().includes(value.toString().toLowerCase())
      } else {
        return Object.values(row).some(cellValue => cellValue && cellValue.toString().toLowerCase().includes(value.toString().toLowerCase()))
      }
    })
  })
}

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, selfControlled, filters, sort } = state

  const filterData = useCallback(data => {
    return getFilteredData(data,filters)
  }, [filters])

  const sortData = useCallback(data => {
    if(!sort.sortBy.field) {
      return data
    }

    const { field, order, type } = sort.sortBy
    switch(type) {
    case 'bool':
      return numberSort(data, field, order)
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
