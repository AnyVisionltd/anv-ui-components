export const actionTypes = Object.freeze({
  SET_HEADERS: 'SET_HEADERS',
  SET_DATA: 'SET_DATA',
  SET_SORTABLE: 'SET_SORTABLE',
  SET_SORT_BY: 'SET_SORT_BY',
})

export const actions = (dispatch) => ({
  setHeaders: (headers) => {
    dispatch({
      type: actionTypes.SET_HEADERS,
      payload: headers,
    })
  },
  setData: data => {
    dispatch({
      type: actionTypes.SET_DATA,
      payload: data
    })
  },
  setSortable: (sortable) => {
    dispatch({
      type: actionTypes.SET_SORTABLE,
      payload: sortable,
    })
  },
  setSortBy: (sortBy) => {
    dispatch({
      type: actionTypes.SET_SORT_BY,
      payload: sortBy,
    })
  },
})
