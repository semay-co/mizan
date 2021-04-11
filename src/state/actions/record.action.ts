import { Actions } from '../../model/action.model'
import { RecordDraft } from '../../model/record.model'

export const updateRecordDraft = (payload: RecordDraft) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_DRAFT,
    payload,
  })

export const updateRecordResult = (payload: string) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_RESULT,
    payload,
  })

export const updateRecordQuery = (payload: string) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_QUERY,
    payload,
  })

export const updateRecordList = (payload: string) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_LIST,
    payload,
  })

export const deleteRecordDraft = () => (dispatch: any) =>
  dispatch({
    type: Actions.DELETE_RECORD_DRAFT,
  })
