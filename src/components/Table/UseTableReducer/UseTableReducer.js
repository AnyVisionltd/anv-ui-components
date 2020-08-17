import { useReducer, useRef } from 'react'
import { actionTypes, actions } from './actions'

const initialState = {
  selfControlled: false,
  columns: [],
  data: [],
  totalItems: 0,
  withRowActions: false,
  filters: [],
  selection: {
    isActive: false,
    items: [],
    excludeMode: false,
  },
  columnManagement: {
    isActive: false,
    isOpen: false,
  },
  sort: {
    sortable: false,
    sortBy: {
	  field: null,
	  order: null,
	  type: '',
    },
  },
}

const toggleSelection = (selection, totalItems, payload) => {
  const { excludeMode, items } = selection
  const { item, isSelected } = payload
  const addItem = excludeMode === isSelected
  if(addItem) {
    if(items.length + 1 === totalItems) {
      return { items: [] , excludeMode: !excludeMode }
    }
    return { items: [...items, item.id] , excludeMode: excludeMode }
  }
  return {
    items: items.filter(id => id !== payload.item.id),
    excludeMode: excludeMode
  }
}

const reducer = (state, action) => {
  switch (action.type) {
  case actionTypes.SET_COLUMNS:
    return { ...state, columns: action.payload }
  case actionTypes.SET_DATA:
    return { ...state, data: [...action.payload] }
  case actionTypes.SET_TOTAL_ITEMS:
    return { ...state, totalItems: action.payload }
  case actionTypes.SET_SELF_CONTROLLED:
    return { ...state, selfControlled: action.payload }
  case actionTypes.SET_WITH_ROW_ACTIONS:
    return { ...state, withRowActions: action.payload }
  case actionTypes.SET_SELECTION_ACTIVITY:
    return { ...state, selection: { ...state.selection, isActive: action.payload } }
  case actionTypes.SET_SELECTION:
    return { ...state, selection: { ...state.selection, items: action.payload.items, excludeMode: action.payload.excludeMode } }
  case actionTypes.TOGGLE_SELECTED_ITEM:
    const selection = toggleSelection(state.selection, state.totalItems, action.payload)
    return { ...state, selection: { ...state.selection, items: selection.items, excludeMode: selection.excludeMode } }
  case actionTypes.TOGGLE_SELECT_ALL:
    const nextItemsData = !state.selection.items.length  ? action.payload.map(item => item.id) : []
    const excludeMode = !state.selfControlled ? !(state.selection.excludeMode || state.selection.items.length) : false
    return { ...state, selection: { ...state.selection, excludeMode, items: !excludeMode ? nextItemsData : [] } }
  case actionTypes.DESELECT_ALL:
    return { ...state, selection: { ...state.selection, excludeMode: false, items: [] } }
  case actionTypes.SET_SORTABLE:
    return { ...state, sort: { ...state.sort, sortable: action.payload } }
  case actionTypes.SET_FILTERS:
    return { ...state, filters: action.payload }
  case actionTypes.SET_SORT_BY:
    return { ...state, sort: { ...state.sort, sortBy: action.payload } }
  case actionTypes.SET_COLUMN_MANAGEMENT_ACTIVITY:
    return { ...state, columnManagement: { ...state.columnManagement, isActive: action.payload } }
  case actionTypes.SET_COLUMN_MANAGEMENT_IS_OPEN:
    return { ...state, columnManagement: { ...state.columnManagement, isOpen: action.payload } }
  default:
    return state
  }
}


export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { current: bondedActions } = useRef(actions(dispatch))
  return [
    state,
    bondedActions,
  ]
}
