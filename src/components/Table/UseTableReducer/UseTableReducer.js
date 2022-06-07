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
    selectBy: 'id',
    items: [],
    excludeMode: false,
    checkRowSelectable: () => true,
    alwaysSelected: new Set(),
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
  const { excludeMode, items, selectBy } = selection
  const { item, isSelected } = payload
  const addItem = excludeMode === isSelected
  if (addItem) {
    if (items.length + 1 === totalItems && excludeMode) {
      return { items: [], excludeMode: !excludeMode }
    }
    return { items: [...items, item[selectBy]], excludeMode: excludeMode }
  }
  return {
    items: items.filter(
      selectByField => selectByField !== payload.item[selectBy],
    ),
    excludeMode: excludeMode,
  }
}
const toggleSelectAll = (
  selection,
  selfControlled,
  payload,
  totalItems,
  checkRowSelectable,
) => {
  const isAllSelected = selfControlled
    ? selection.items.length === totalItems
    : selection.excludeMode && !selection.items.length
  let excludeMode = selection.excludeMode
  let items = []
  if (selfControlled) {
    items = !selection.items.length
      ? payload
          .filter(item => checkRowSelectable(item))
          .map(item => item[selection.selectBy])
      : []
  } else {
    excludeMode = !isAllSelected && !selection.items.length
  }
  return {
    excludeMode,
    items,
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
      return {
        ...state,
        selection: {
          ...state.selection,
          isActive: action.payload.selectable,
          selectBy: action.payload.selectBy,
        },
      }
    case actionTypes.SET_SELECTION:
      return {
        ...state,
        selection: {
          ...state.selection,
          items: action.payload.items,
          excludeMode: action.payload.excludeMode,
        },
      }
    case actionTypes.SET_ALWAYS_SELECTION:
      return {
        ...state,
        selection: {
          ...state.selection,
          alwaysSelected: action.payload,
        },
      }
    case actionTypes.SET_CHECK_ROW_SELECTABLE:
      return {
        ...state,
        selection: {
          ...state.selection,
          checkRowSelectable: action.payload,
        },
      }
    case actionTypes.TOGGLE_SELECTED_ITEM:
      const selection = toggleSelection(
        state.selection,
        state.totalItems,
        action.payload,
      )
      return {
        ...state,
        selection: {
          ...state.selection,
          items: selection.items,
          excludeMode: selection.excludeMode,
        },
      }
    case actionTypes.TOGGLE_SELECT_ALL:
      const newSelection = toggleSelectAll(
        state.selection,
        state.selfControlled,
        action.payload,
        state.totalItems,
        state.selection.checkRowSelectable,
      )
      return { ...state, selection: { ...state.selection, ...newSelection } }
    case actionTypes.DESELECT_ALL:
      return {
        ...state,
        selection: { ...state.selection, excludeMode: false, items: [] },
      }
    case actionTypes.SET_SORTABLE:
      return { ...state, sort: { ...state.sort, sortable: action.payload } }
    case actionTypes.SET_FILTERS:
      return { ...state, filters: action.payload }
    case actionTypes.SET_SORT_BY:
      return { ...state, sort: { ...state.sort, sortBy: action.payload } }
    case actionTypes.SET_COLUMN_MANAGEMENT_ACTIVITY:
      return {
        ...state,
        columnManagement: {
          ...state.columnManagement,
          isActive: action.payload,
        },
      }
    case actionTypes.SET_COLUMN_MANAGEMENT_IS_OPEN:
      return {
        ...state,
        columnManagement: { ...state.columnManagement, isOpen: action.payload },
      }
    default:
      return state
  }
}

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { current: bondedActions } = useRef(actions(dispatch))
  return [state, bondedActions]
}
