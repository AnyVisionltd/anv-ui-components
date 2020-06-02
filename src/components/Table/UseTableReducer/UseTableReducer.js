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
  case actionTypes.TOGGLE_SELECTED_ITEM:
    let items
    if((!state.selection.exceptMode && !action.payload.isSelected) ||
	  (action.payload.isSelected && state.selection.exceptMode)) {
	  if(state.selection.items.length + 1 === state.totalItems) {
        return { ...state, selection: { ...state.selection, exceptMode: !state.selection.exceptMode, items: [] } }
	  }
      items = [...state.selection.items, action.payload.item]
    } else {
	  items = state.selection.items.filter(item => item !== action.payload.item )
    }
    return { ...state, selection: { ...state.selection, items } }
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
