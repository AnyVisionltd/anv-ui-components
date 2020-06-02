import { orderTypes } from './enums/common'

export const stringSort = (data, field, order) => data.sort((rowA, rowB) => {
  if(order === orderTypes.ASC) {
    return rowB[field].localeCompare(rowA[field], undefined, { sensitivity: 'base' })
  }
  return rowA[field].localeCompare(rowB[field], undefined, { sensitivity: 'base' })
})

export const numberSort = (data, field, order) => data.sort((rowA, rowB) => {
  if (order === orderTypes.ASC) {
    return rowB[field] - rowA[field]
  }
  return rowA[field] - rowB[field]
}
)
