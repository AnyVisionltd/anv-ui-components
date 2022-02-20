import { useReducer, useRef } from 'react'
import { actions as actionCreators, actionTypes } from './actions'

const initialState = {
  columns: [],
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.SET_COLUMNS:
      return { ...state, columns: payload }
    default:
      return state
  }
}

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { current: actions } = useRef(actionCreators(dispatch))
  return [state, actions]
}
