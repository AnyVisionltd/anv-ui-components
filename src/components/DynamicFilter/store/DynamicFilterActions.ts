export enum DynamicFilterActionsTypes {
  TOGGLE_IS_MENU_OPEN = 'TOGGLE_IS_MENU_OPEN',
  UPDATE_ELEMENTS_STATE = 'UPDATE_ELEMENTS_STATE',
  SET_IS_DATE_PICKER_OPEN = 'SET_IS_DATE_PICKER_OPEN',
  SET_IS_MENU_DROPDOWN_OPEN = 'SET_IS_MENU_DROPDOWN_OPEN',
}

type ToggleIsMenuOpenAction = {
  type: DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN
}

type SetIsMenuDropdownOpenAction = {
  type: DynamicFilterActionsTypes.SET_IS_MENU_DROPDOWN_OPEN
  payload: boolean
}

type SetIsDatePickerOpenAction = {
  type: DynamicFilterActionsTypes.SET_IS_DATE_PICKER_OPEN
  payload: boolean
}

type UpdateElementsStateAction = {
  type: DynamicFilterActionsTypes.UPDATE_ELEMENTS_STATE
  payload: Record<string, any>
}

export type DynamicFilterActions =
  | ToggleIsMenuOpenAction
  | UpdateElementsStateAction
  | SetIsDatePickerOpenAction
  | SetIsMenuDropdownOpenAction

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
  setIsDatePickerOpen: (payload: boolean) => {
    dispatch({
      type: DynamicFilterActionsTypes.SET_IS_DATE_PICKER_OPEN,
      payload,
    } as SetIsDatePickerOpenAction)
  },
  setIsMenuDropdownOpen: (payload: boolean) => {
    dispatch({
      type: DynamicFilterActionsTypes.SET_IS_MENU_DROPDOWN_OPEN,
      payload,
    } as SetIsMenuDropdownOpenAction)
  },
})
