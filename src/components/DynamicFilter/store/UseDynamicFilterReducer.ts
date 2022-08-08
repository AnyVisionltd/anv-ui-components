import { useReducer, useRef } from 'react'
import { DynamicFilterStateInterface } from '../utils'
import {
  DynamicFilterActions,
  dynamicFilterActions,
  DynamicFilterActionsTypes,
} from './DynamicFilterActions'

const DynamicFilterInitialState: DynamicFilterStateInterface = {
  isMenuOpen: false,
  elementsState: {},
  isDatePickerOpen: false,
  isMenuDropdownOpen: false,
}

const reducer = (
  state: DynamicFilterStateInterface,
  action: DynamicFilterActions,
) => {
  switch (action.type) {
    case DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      }
    case DynamicFilterActionsTypes.UPDATE_ELEMENTS_STATE:
      return {
        ...state,
        elementsState: {
          ...state.elementsState,
          [action.payload.key]: action.payload.value,
        },
      }
    case DynamicFilterActionsTypes.SET_IS_DATE_PICKER_OPEN:
      return {
        ...state,
        isDatePickerOpen: action.payload,
      }
    case DynamicFilterActionsTypes.SET_IS_MENU_DROPDOWN_OPEN:
      return {
        ...state,
        isMenuDropdownOpen: action.payload,
      }
    default:
      return state
  }
}

export default () => {
  const [state, dispatch] = useReducer(reducer, DynamicFilterInitialState)
  const { current: bondedActions } = useRef(dynamicFilterActions(dispatch))
  return { state, actions: bondedActions }
}
