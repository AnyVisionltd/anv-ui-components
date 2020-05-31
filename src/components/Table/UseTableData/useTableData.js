import { useMemo, useContext, useCallback } from 'react'
import TableContext from '../TableContext'

const useTableData = () => {
  const { state } = useContext(TableContext)
  const { data, controlled, filters } = state

  const filterData = useCallback(() => {
    return data.filter(row => {
      return filters.every(({ field, value }) => {
        if(field) {
          return row[field].toLowerCase().includes(value)
        } else {
          return Object.values(row).some(cellValue => cellValue.toLowerCase().includes(value))
        }
      })
    })
  }, [data, filters])

  return useMemo(() => {
    if(controlled) {
      return data
    }

    return filterData()
  }, [data, controlled, filterData])

}

export default useTableData
