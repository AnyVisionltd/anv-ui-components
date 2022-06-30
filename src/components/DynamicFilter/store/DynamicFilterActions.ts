export enum DynamicFilterActionsTypes {
  TOGGLE_IS_MENU_OPEN = 'TOGGLE_IS_MENU_OPEN',
}

type ToggleIsMenuOpenAction = {
  type: DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN
}

export type DynamicFilterActions = ToggleIsMenuOpenAction

export const dynamicFilterActions = (
  dispatch: React.Dispatch<DynamicFilterActions>,
) => ({
  toggleIsMenuOpen: () => {
    dispatch({
      type: DynamicFilterActionsTypes.TOGGLE_IS_MENU_OPEN,
    } as ToggleIsMenuOpenAction)
  },
})
