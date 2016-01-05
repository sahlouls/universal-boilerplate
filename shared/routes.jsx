/* beautify preserve:start */

import React from 'react'
import {Router, Route, browserHistory} from 'react-router'

import App from './containers/App'

/* beautify preserve:end */

export default (
  <Router history={browserHistory}>
    <Route component={App} path="/" />
  </Router>
)
