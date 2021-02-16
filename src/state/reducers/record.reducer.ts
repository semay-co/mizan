import { Actions } from '../../model/action.model'

export const record = (state = [], action: any) => {
  switch (action.type) {
    case Actions.UPDATE_RECORD_DRAFT:
      return {
        ...state,
        recordDraft: action.payload,
      }
    case Actions.DELETE_RECORD_DRAFT:
      return {
        ...state,
        recordDraft: undefined,
      }
    default:
      return state
  }
}
