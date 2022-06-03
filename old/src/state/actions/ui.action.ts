import { Actions } from '../../model/action.model'

export const updateUIState = (state: any) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_UI_STATE,
    payload: state,
  })
