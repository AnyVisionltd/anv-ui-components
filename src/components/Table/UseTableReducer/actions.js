export const actionTypes = Object.freeze({
  SET_HEADERS: 'SET_HEADERS',
  SET_DATA: 'SET_DATA',
  SET_CONTROLLED: 'SET_CONTROLLED',
  SET_WITH_ROW_ACTIONS: 'SET_WITH_ROW_ACTIONS',
  SET_SORTABLE: 'SET_SORTABLE',
  SET_FILTERS: 'SET_FILTERS',
  SET_SORT_BY: 'SET_SORT_BY',
})

export const actions = dispatch => ({
  setHeaders: headers => {
    dispatch({
      type: actionTypes.SET_HEADERS,
      payload: headers,
    })
  },
  setData: data => {
    dispatch({
      type: actionTypes.SET_DATA,
      payload: data,
    })
  },
  setControlled: data => {
    dispatch({
      type: actionTypes.SET_CONTROLLED,
      payload: data,
    })
  },
  setWithRowActions: withSortActions => {
    dispatch({
      type: actionTypes.SET_WITH_ROW_ACTIONS,
      payload: withSortActions,
    })
  },
  setSortable: sortable => {
    dispatch({
      type: actionTypes.SET_SORTABLE,
      payload: sortable,
    })
  },
  setFilters: filters => {
    dispatch({
      type: actionTypes.SET_FILTERS,
      payload: filters,
    })
  },
  setSortBy: sortBy => {
    dispatch({
      type: actionTypes.SET_SORT_BY,
      payload: sortBy,
    })
  },
})
