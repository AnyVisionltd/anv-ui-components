export const actionTypes = Object.freeze({
  SET_SELF_CONTROLLED: 'SET_SELF_CONTROLLED',
  DESELECT_ALL: 'DESELECT_ALL',
  SET_COLUMNS: 'SET_COLUMNS',
  SET_DATA: 'SET_DATA',
  SET_TOTAL_ITEMS: 'SET_TOTAL_ITEMS',
  SET_WITH_ROW_ACTIONS: 'SET_WITH_ROW_ACTIONS',
  SET_SORTABLE: 'SET_SORTABLE',
  SET_SELECTION_ACTIVITY: 'SET_SELECTION_ACTIVITY',
  SET_SELECTION: 'SET_SELECTION',
  SET_ALWAYS_SELECTION: 'SET_ALWAYS_SELECTION',
  SET_CHECK_ROW_SELECTABLE: 'SET_CHECK_ROW_SELECTABLE',
  TOGGLE_SELECTED_ITEM: 'TOGGLE_SELECTED_ITEM',
  TOGGLE_SELECT_ALL: 'TOGGLE_SELECT_ALL',
  SET_FILTERS: 'SET_FILTERS',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_COLUMN_MANAGEMENT_ACTIVITY: 'SET_COLUMN_MANAGEMENT_ACTIVITY',
  SET_COLUMN_MANAGEMENT_IS_OPEN: 'SET_COLUMN_MANAGEMENT_IS_OPEN',
})

export const actions = dispatch => ({
  setColumns: columns => {
    dispatch({
      type: actionTypes.SET_COLUMNS,
      payload: columns,
    })
  },
  setData: data => {
    dispatch({
      type: actionTypes.SET_DATA,
      payload: data,
    })
  },
  setTotalItems: totalItems => {
    dispatch({
      type: actionTypes.SET_TOTAL_ITEMS,
      payload: totalItems,
    })
  },
  setSelfControlled: data => {
    dispatch({
      type: actionTypes.SET_SELF_CONTROLLED,
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
  setSelection: selection => {
    dispatch({
      type: actionTypes.SET_SELECTION,
      payload: selection,
    })
  },
  setAlwaysSelection: alwaysSelectionSet => {
    dispatch({
      type: actionTypes.SET_ALWAYS_SELECTION,
      payload: alwaysSelectionSet,
    })
  },
  setCheckRowSelectable: checkRowSelectable => {
    dispatch({
      type: actionTypes.SET_CHECK_ROW_SELECTABLE,
      payload: checkRowSelectable,
    })
  },
  setSelectionActivity: (selectable, selectBy) => {
    dispatch({
      type: actionTypes.SET_SELECTION_ACTIVITY,
      payload: { selectable, selectBy },
    })
  },
  toggleSelectedItem: (item, isSelected) => {
    dispatch({
      type: actionTypes.TOGGLE_SELECTED_ITEM,
      payload: { item, isSelected },
    })
  },
  toggleSelectAll: currentData => {
    dispatch({
      type: actionTypes.TOGGLE_SELECT_ALL,
      payload: currentData,
    })
  },
  deselectAll: () => {
    dispatch({
      type: actionTypes.DESELECT_ALL,
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
  setColumnManagementActivity: isActive => {
    dispatch({
      type: actionTypes.SET_COLUMN_MANAGEMENT_ACTIVITY,
      payload: isActive,
    })
  },
  setColumnManagementIsOpen: isOpen => {
    dispatch({
      type: actionTypes.SET_COLUMN_MANAGEMENT_IS_OPEN,
      payload: isOpen,
    })
  },
})
