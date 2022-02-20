export const actionTypes = {
  SET_COLUMNS: 'SET_COLUMNS',
}

export const actions = dispatch => ({
  setColumns: columns => {
    dispatch({
      type: actionTypes.SET_COLUMNS,
      payload: columns,
    })
  },
})
