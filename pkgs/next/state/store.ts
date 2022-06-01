import { applyMiddleware, compose, createStore } from 'redux'
import { actors } from './actors'
import thunk from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

const componentEnhancers = composeWithDevTools({
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
  actors,
  initialState,
  // componentEnhancers(),
  compose(applyMiddleware(...middleware), componentEnhancers())
)

export default store
