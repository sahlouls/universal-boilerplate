function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function fetchCounter(callback) {
  // Rather than immediately returning, we delay our code with a timeout to simulate asynchronous behavior
  setTimeout(() => {
    console.log('Inside fetchCounter')
    callback(getRandomInt(1, 100))
  }, 1000)

  // In the case of a real world API call, you'll normally run into a Promise like this:
  // API.getUser().then(user => callback(user))
}
