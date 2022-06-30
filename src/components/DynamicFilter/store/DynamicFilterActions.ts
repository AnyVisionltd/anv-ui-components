export enum DynamicFilterActionsTypes {
  SET_TEST = 'SET_TEST',
  SET_TEST_2 = 'SET_TEST_2',
}

type SetTestAction = {
  type: DynamicFilterActionsTypes.SET_TEST
  payload: string
}

type SetTest2Action = {
  type: DynamicFilterActionsTypes.SET_TEST_2
  payload: string
}

export type DynamicFilterActions = SetTestAction | SetTest2Action

export const dynamicFilterActions = (
  dispatch: React.Dispatch<DynamicFilterActions>,
) => ({
  setTest: (action: SetTestAction) => {
    dispatch(action)
  },
  setTest2: (action: SetTest2Action) => {
    dispatch(action)
  },
})
