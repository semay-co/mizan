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
    case Actions.UPDATE_RECORD_RESULT:
      return {
        ...state,
        recordResult: action.payload,
      }
    case Actions.UPDATE_RECORD_QUERY:
      return {
        ...state,
        recordQuery: action.payload,
      }
    case Actions.UPDATE_RECORD_LIST:
      return {
        ...state,
        recordList: action.payload,
      }
    default:
      return state
  }
}
