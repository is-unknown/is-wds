var packageNames = require("./packages")
var hasown = require("hasown")
var isFunction = require("is-function")
var isObject = require("is-object")

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
}

function suppressConsole() {
  global.console.log = () => {}
  global.console.error = () => {}
  global.console.warn = () => {}
  global.console.info = () => {}
}

function unsupressConsole() {
  global.console.log = originalConsole.log
  global.console.error = originalConsole.error
  global.console.warn = originalConsole.warn
  global.console.info = originalConsole.info
}

function suppressConsoleWithCallback(callback) {
  suppressConsole()

  let result
  try {
    result = callback()
  } finally {
    unsupressConsole()
  }

  return result
}
function getUnfilteredPackages(names) {
  var packages = []
  var specialFunctions = {}
  names.forEach((name) => {
    try {
      var package = suppressConsoleWithCallback(() => require(name))
      if (hasown(package, "isWds") || hasown(package, "isWDS")) {
        packages.push(package.isWds)
      } else if (hasown(package, "default")) {
        packages.push(package.default)
      } else {
        packages.push(package)
      }
      if (isObject(package) && (hasown(package, "isWds") || hasown(package, "isWDS")) && Object.entries(package).length > 1) {
        for (const key in package) {
          var value = package[key]
          if (key === "isWDS" || key === "isWds") continue
          specialFunctions[key] = value
        }
      }
    } catch {}
  })
  return {
    packages,

    specialFunctions
  }
}

function filterPackages(packages) {
  return packages.filter((package) => {
    if (!isFunction(package)) return false
    try {
      canconsolelog = false
      let test = package("WDS")
      canconsolelog = true
      if (test === true) {
        return test
      } else {
        return false
      }
    } catch {
      return false
    }
  })
}

var { packages: unfilteredPackages } = getUnfilteredPackages(packageNames)
var filteredPackages = filterPackages(unfilteredPackages)

function isWDS(value) {
  var result = true
  for (var i = 0; i < filteredPackages.length; i++) {
    var package = filteredPackages[i]
    result = result && package(value)
  }
  return result
}

module.exports = isWDS /*

for (let key in specialFunctions) {
  var specialfn = specialFunctions[key]
  module.exports[key] = specialfn
}*/
