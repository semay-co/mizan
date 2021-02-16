import { combineReducers } from 'redux'
import { scoreboard } from './scroeboard.reducer'
import { record } from './record.reducer'

export const reducers = combineReducers({
  scoreboard,
  record,
})
