'use strict'

const crypto = require('crypto')

function hash (input) {
  const h = crypto.createHash('md5')
  input = typeof input === 'string' ? input : JSON.stringify(input)
  input = typeof input !== 'undefined' && input !== 'undefined' && input !== null ? input : ''
  return crypto.createHash('md5').update(input, 'utf8').digest('hex')
}

module.exports = hash
