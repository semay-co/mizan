import { applyMiddleware, compose, createStore } from 'redux'
import { actors } from './actors'
import thunk from 'redux-thunk'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

const componentEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {}

const middleware = [thunk]

const store = createStore(
  actors,
  initialState,
  // componentEnhancers(),
  compose(applyMiddleware(...middleware), componentEnhancers())
)

export default store
