/* beautify preserve:start */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import { devTools, persistState } from 'redux-devtools'

import rootReducer from '../reducers'

/* beautify preserve:end */

// // Hung reudx-devtools
// let _createStore
// if (window.$REDUX_DEVTOOL) {
//   _createStore = compose(devTools(), createStore)
// } else {
//   _createStore = createStore
// }

const logger = loggerMiddleware({
  level: 'info',
  collapsed: true,
  // predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN
})

// Rewritten to support devTools
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  logger
)(createStore)

export default function configureStore(initialState = undefined) {

  const store = createStoreWithMiddleware(rootReducer, initialState)

  // Module is webpack bale layer provided when, signature as follows:
  // function(module, exports, __webpack_require__) {
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
