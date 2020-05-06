export const actionTypes = Object.freeze({
  SET_HEADERS: 'SET_HEADERS',
  SET_SORT: 'SET_SORT',
})

export const actions = (dispatch) => ({
  setHeaders: (headers) => {
    dispatch({
      type: actionTypes.SET_HEADERS,
      payload: headers,
    })
  },
  setSort: (sort) => {
    dispatch({
      type: actionTypes.SET_SORT,
      payload: sort,
    })
  },
})
