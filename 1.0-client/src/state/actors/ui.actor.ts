import { Actions } from '../../model/action.model'

export const ui = (state = [], action: any) => {
  switch (action.type) {
    case Actions.UPDATE_UI_STATE:
      return action.payload
    default:
      return state
  }
}
