import { Actions } from '../../model/action.model'
import { RecordDraft } from '../../model/record.model'

export const updateRecordDraft = (draft: RecordDraft) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_DRAFT,
    payload: draft,
  })

export const updateRecordQuery = (payload: string) => (dispatch: any) =>
  dispatch({
    type: Actions.UPDATE_RECORD_QUERY,
    payload,
  })

export const deleteRecordDraft = () => (dispatch: any) =>
  dispatch({
    type: Actions.DELETE_RECORD_DRAFT,
  })
