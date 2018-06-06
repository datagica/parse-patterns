'use strict'

function toId (input) {
  return input.toLowerCase().replace(/ +/gi, '-')
}

module.exports = toId
