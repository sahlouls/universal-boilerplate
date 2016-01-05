/* beautify preserve:start */

if (process.env.BROWSER) {
  const {createHistory} = require('history')
  module.exports = createHistory()
}

/* beautify preserve:end */
