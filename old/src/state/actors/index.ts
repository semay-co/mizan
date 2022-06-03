import { combineReducers } from 'redux'
import { scoreboard } from './scroeboard.actor'
import { record } from './record.actor'
import { ui } from './ui.actor'

export const actors = combineReducers({
  scoreboard,
  record,
  ui,
})
