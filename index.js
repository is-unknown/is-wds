var factory = require('./factory')
var isWds = factory()

module.exports = function isWDS(value) {
  return !!isWds(value)
}

module.exports.default = module.exports
module.exports.isWDS = module.exports.default