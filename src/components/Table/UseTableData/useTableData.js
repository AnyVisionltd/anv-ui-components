import { useMemo, useContext, useCallback } from 'react'
import { orderTypes } from "../../../utils/enums/common"
import TableContext from '../TableContext'

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, controlled, filters, sort } = state

  const filterData = useCallback(data => {
    return data.filter(row => {
      return filters.every(({ field, value }) => {
        if(field) {
          return row[field].toLowerCase().includes(value)
        } else {
          return Object.values(row).some(cellValue => cellValue.toLowerCase().includes(value))
        }
      })
    })
  }, [filters])

  const sortData = useCallback(data => {
    if(!sort.sortBy.field) {
      return data
    }
    const defaultSort = (data, field) => data.sort((rowA, rowB) => (
      rowA[field].localeCompare(rowB[field], undefined, { sensitivity: 'base' }))
    )
    const { field, order } = sort.sortBy
    const sortedData = defaultSort(data, field).reverse()
    return order === orderTypes.DESC ? sortedData.reverse() : sortedData

  }, [sort])

  return useMemo(() => {
    let tableData
    if(controlled) {
      return data
    }

    tableData = filterData(data)
    tableData = sortData(data)

    return tableData
  }, [data, controlled, sortData, filterData])

}

export default useTableData
