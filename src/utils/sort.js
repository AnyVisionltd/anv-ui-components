import { orderTypes } from './enums/common'

export const stringSort = (data, field, order) =>
  data.sort((rowA, rowB) => {
    if (order === orderTypes.ASC) {
      return rowA[field].localeCompare(rowB[field], undefined, {
        numeric: true,
        sensitivity: 'base',
        caseFirst: 'upper',
      })
    }
    return rowB[field].localeCompare(rowA[field], undefined, {
      numeric: true,
      sensitivity: 'base',
      caseFirst: 'upper',
    })
  })

export const numberSort = (data, field, order) =>
  data.sort((rowA, rowB) => {
    if (order === orderTypes.ASC) {
      return rowA[field] - rowB[field]
    }
    return rowB[field] - rowA[field]
  })
