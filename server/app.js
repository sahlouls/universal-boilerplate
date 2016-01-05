/* beautify preserve:start */

// import fs from 'fs'
// import https from 'https'
// import compression from 'compression'
import express from 'express'
import logger from 'morgan'
import qs from 'qs'
// import cookieParser from 'cookie-parser'

import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'

import {RoutingContext, match} from 'react-router'
// import escapeHTML from 'lodash/string/escape'

import routes from '../shared/routes.jsx'
import configureStore from '../shared/store/configureStore'

import { fetchCounter } from '../shared/api/counter'
import clientConfig from '../etc/client-config.json'

// // Configure SSL properties for the server
// const sslProperties = {
//   key: fs.readFileSync('./ssl/server.key'),
//   cert: fs.readFileSync('./ssl/server.crt'),
//   ca: fs.readFileSync('./ssl/ca.crt'),
//   requestCert: true,
//   rejectUnauthorized: false
// }

// Create express app server
const app = express()
// // compress all requests
// app.use(compression())
// Setup logger
app.use(logger('dev'))
// Take port from env or default it
const PORT = 3001
app.set('port', process.env.PORT || PORT)

// Use public/static folder
app.use('/static', express.static('public/static'))
// // Use cookies
// app.use(cookieParser())

// This is fired every time the server side receives a request
app.use((req, res) => {
  const store = configureStore()

  match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (!renderProps) {
      res.status(404).send('Not found')
    } else {

      // Query our mock API asynchronously
      fetchCounter(apiResult => {
        // Read the counter from the request, if provided
        const params = qs.parse(req.query)
        const counter = parseInt(params.counter, 10) || apiResult || 0

        // Compile an initial state
        const initialState = { counter }

        // Create a new Redux store instance
        const store = configureStore(initialState)

        const componentHTML = ReactDOM.renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps}/>
          </Provider>
        )

        // const initialState = store.getState()
        const title = 'Universal Voting App'

        const html = renderHTML({
          componentHTML,
          title,
          initialState,
          config : clientConfig
        })

        res.status(200).end(html)
      })
    }
  })
})

function renderHTML({componentHTML, title, initialState, config}) {
  return `
      <!DOCTYPE html>
      <html class="no-js" lang="en">

      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="shortcut icon" href="/static/favicon.ico"/>
          <title>${title}</title>

          <!-- <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.cyan-pink.min.css" />
          <link rel="stylesheet" href="//cdn.materialdesignicons.com/1.2.65/css/materialdesignicons.min.css"> -->
          <link rel="stylesheet" href="${config.staticUrl}/static/build/main.css">
          <!-- <script src="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js"></script> -->
      </head>

      <body>
      <!--[if lt IE 8]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
      <![endif]-->
      <div id="react-view">${componentHTML}</div>

        <script type="application/javascript">
          window.__CONFIG__ = ${JSON.stringify(config)};
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>

        <script type="application/javascript" src="${config.staticUrl}/static/build/main.js"></script>
      </body>

      </html>
  `
}

/* beautify preserve:end */

// // Instantiate the SSL server with Express
// var server = https.createServer(sslProperties, app).listen(app.get('port'), () => {
//   console.log('Secure Express server listening on port', app.get('port'))
// })

// start server
app.listen(app.get('port'), (error) => {
  if (error) {
    console.error(error)
  } else {
    console.log(`==> 🌎  Listening on port ${app.get('port')}. Open up http://localhost:${app.get('port')}/ in your browser.`)
  }
})
