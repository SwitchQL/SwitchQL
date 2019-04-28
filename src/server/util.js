function toTitleCase(str) {
  let transformed = str[0].toUpperCase();
  transformed += str.slice(1).toLowerCase();
  return transformed;
}

function promiseTimeout(msDelay, promise) {

  //promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id)
      reject(`Timed out in ${msDelay} ms`)
    }, msDelay)
  })

  //
  return Promise.race([
    promise,
    timeout
  ])
}

module.exports = {
  toTitleCase,
  promiseTimeout
};