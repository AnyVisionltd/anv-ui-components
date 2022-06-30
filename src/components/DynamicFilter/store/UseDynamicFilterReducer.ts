import { useReducer, useRef } from 'react'
import { DynamicFilterStateInterface } from '../utils'
import {
  DynamicFilterActions,
  dynamicFilterActions,
  DynamicFilterActionsTypes,
} from './DynamicFilterActions'

export const DynamicFilterInitialState: DynamicFilterStateInterface = {
  test: 'test',
}

const reducer = (
  state: DynamicFilterStateInterface,
  action: DynamicFilterActions,
): DynamicFilterStateInterface => {
  switch (action.type) {
    case DynamicFilterActionsTypes.SET_TEST:
      const { payload: test } = action
      return {
        ...state,
        test,
      }
    default:
      return state
  }
}

export default () => {
  const [state, dispatch] = useReducer(reducer, DynamicFilterInitialState)
  const { current: bondedActions } = useRef(dynamicFilterActions(dispatch))
  return [state, bondedActions]
}
