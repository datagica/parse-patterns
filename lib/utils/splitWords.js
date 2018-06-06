'use strict'

// split the name into words using only spaces and/or line returns
// (because some text may have accidental line return and that's okay)
const pattern = /[ \r\n]/g
function splitWords (input) { return input.split(pattern) }

module.exports = splitWords
