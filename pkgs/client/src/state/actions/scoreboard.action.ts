import { Actions } from '../../model/action.model'

export const updateReading = (reading: any) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_SCOREBOARD,
    payload: reading,
  })
