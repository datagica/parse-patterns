'use strict'

function cleanKeys(obj){

  if (Array.isArray(obj)) {
    return obj.map(x => cleanKeys(x))
  }

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') {
      delete obj[key]
    }
  })

  return obj
}

module.exports = cleanKeys
