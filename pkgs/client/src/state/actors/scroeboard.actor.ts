import { Actions } from '../../model/action.model'

export const scoreboard = (state: any = [], action: any) => {
  switch (action.type) {
    case Actions.UPDATE_SCOREBOARD:
      return {
        // TODO: use immer
        ...state,
        reading: action.payload,
      }
    case Actions.RESET_SCOREBOARD:
      return 0
    case Actions.DELETE_RECORD_DRAFT:
      return {
        ...state,
        capture: action.payload,
      }
    default:
      return state
  }
}
