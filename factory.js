var isWDS = require('./isWDS')

function factory() {
  return isWDS.bind(isWDS)
}

module.exports = factory