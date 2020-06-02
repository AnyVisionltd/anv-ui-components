import { useReducer, useRef } from 'react'
import { actionTypes, actions } from './actions'

const initialState = {
  selfControlled: false,
  headers: [],
  data: [],
  totalItems: 0,
  withRowActions: false,
  filters: [],
  selection: {
    isActive: false,
    items: [],
    exceptMode: false,
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
  const { exceptMode, items } = selection
  const { item, isSelected } = payload
  if((exceptMode === isSelected)) {
    if(items.length + 1 === totalItems) {
      return { items: [] , exceptMode: !exceptMode }
    }
    return { items: [...items, item] , exceptMode: exceptMode }
  }
  return {
    items: items.filter(item => item !== payload.item),
    exceptMode: exceptMode
  }
}

const reducer = (state, action) => {
  switch (action.type) {
  case actionTypes.SET_HEADERS:
    return { ...state, headers: action.payload }
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
    return { ...state, selection: { ...state.selection, items: action.payload.items, exceptMode: action.payload.exceptMode } }
  case actionTypes.TOGGLE_SELECTED_ITEM:
    const selection = toggleSelection(state.selection, state.totalItems, action.payload)
    return { ...state, selection: { ...state.selection, items: selection.items, exceptMode: selection.exceptMode } }
  case actionTypes.TOGGLE_SELECT_ALL:
    const exceptMode = !(state.selection.exceptMode || state.selection.items.length)
    return { ...state, selection: { ...state.selection, exceptMode, items: [] } }
  case actionTypes.SET_SORTABLE:
    return { ...state, sort: { ...state.sort, sortable: action.payload } }
  case actionTypes.SET_FILTERS:
    return { ...state, filters: action.payload }
  case actionTypes.SET_SORT_BY:
    return { ...state, sort: { ...state.sort, sortBy: action.payload } }
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
