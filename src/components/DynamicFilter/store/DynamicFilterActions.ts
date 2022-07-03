export enum DynamicFilterActionsTypes {
  TOGGLE_IS_MENU_OPEN = 'TOGGLE_IS_MENU_OPEN',
  UPDATE_ELEMENTS_STATE = 'UPDATE_ELEMENTS_STATE',
}

type ToggleIsMenuOpenAction = {
  type: DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN
}

type UpdateElementsStateAction = {
  type: DynamicFilterActionsTypes.UPDATE_ELEMENTS_STATE
  payload: Record<string, any>
}

export type DynamicFilterActions =
  | ToggleIsMenuOpenAction
  | UpdateElementsStateAction

export const dynamicFilterActions = (
  dispatch: React.Dispatch<DynamicFilterActions>,
) => ({
  toggleIsMenuOpen: () => {
    dispatch({
      type: DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN,
    } as ToggleIsMenuOpenAction)
  },
  updateElementsState: (payload: Record<string, any>) => {
    dispatch({
      type: DynamicFilterActionsTypes.UPDATE_ELEMENTS_STATE,
      payload,
    } as UpdateElementsStateAction)
  },
})
