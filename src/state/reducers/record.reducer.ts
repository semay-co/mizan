import { Actions } from '../../model/action.model'

export const record = (state = [], action: any) => {
  switch (action.type) {
    case Actions.UPDATE_RECORD_DRAFT:
      return {
        recordDraft: action.payload,
      }
    case Actions.DELETE_RECORD_DRAFT:
      return {
        recordDraft: undefined,
      }
    case Actions.UPDATE_RECORD_RESULT:
      return {
        recordResult: action.payload,
      }
    case Actions.UPDATE_RECORD_QUERY:
      return {
        recordQuery: action.payload,
      }
    default:
      return state
  }
}
