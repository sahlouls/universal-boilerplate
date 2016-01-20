/* beautify preserve:start */

//import 'babel-core/polyfill'

import React        from 'react'
import ReactDOM     from 'react-dom'
import { Provider } from 'react-redux'
import { Router }   from 'react-router'
import fetch        from 'isomorphic-fetch'

import configureStore from '../shared/store/configureStore'
import routes         from './../shared/routes.jsx'
import history        from './../shared/history'

/* beautify preserve:end */

const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)
const rootElement = document.getElementById('react-view')

ReactDOM.render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,

  rootElement
)
