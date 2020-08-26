import { orderTypes } from './enums/common'

export const stringSort = (data, field, order) => data.sort((rowA, rowB) => {
  if(order === orderTypes.ASC) {
    return rowB[field].localeCompare(rowA[field], undefined, { caseFirst: 'upper' })
  }
  return rowA[field].localeCompare(rowB[field], undefined, { caseFirst: 'upper' })
})

export const numberSort = (data, field, order) => data.sort((rowA, rowB) => {
  if (order === orderTypes.ASC) {
    return rowB[field] - rowA[field]
  }
  return rowA[field] - rowB[field]
}
)
