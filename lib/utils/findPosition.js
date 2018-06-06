'use strict'

const splitWords = require('./splitWords')

/**
 * Compute position of a needle inside the haystack
 * This uses another a position object as a referential
 *
 * haystack: string
 * needle: string
 * position: object
 */
function findPosition (haystack, needle, position) {

  const needles = splitWords(needle)
  const stacks  = splitWords(haystack)

  let buffer = ''

  for (let i = 0; i < stacks.length; i++) {

    buffer += stacks[i] + ' '

    const index = buffer.indexOf(needle)

    if (index == -1) { continue }

    // we remove one to word, begin, and because we append
    // a space on our input before using the RegExp
    return {
      sentence: position.sentence,
      word    : position.word  + Math.max(0, i - needles.length - 1),
      begin   : position.begin + Math.max(0, index - 1),
      end     : position.end   + Math.max(0, index - 1 + needle.length)
    }
  }

  return position
}

module.exports = findPosition
