// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import express from 'express' // call express
import bodyParser from 'body-parser'
const app = express() // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

const port = process.env.PORT || 8081 // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Method: %s, Path: %s', req.method, req.url)
  next() // make sure we go to the next routes and don't stop here
})

let count = 5

router.route('/counter')
  .get((req, res) => {
    res.json({
      count: count
    })
  })

router.route('/counter/inc')
  .get((req, res) => {
    count += 1
    res.json({
      count: count
    })
  })

router.route('/counter/dec')
  .get((req, res) => {
    count -= 1
    res.json({
      count: count
    })
  })

router.route('/counter/inc-odd')
  .get((req, res) => {
    if (count % 2 !== 0) {
      count += 1
      res.json({
        count: count
      })
    } else {
      res.json({
        count: count
      })
    }
  })



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to counter api!'
  })
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Magic happens on port ' + port)
