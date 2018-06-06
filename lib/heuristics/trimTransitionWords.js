'use strict'

/*
Trim transition words from a sentence

*/

const trimLeft = [

  // english
  'and',
  'or',
  'with',
  'but',
  'between',

  // french
  'et',
  'ou',
  'avec',
  'mais',
  'entre',
]

const trimRight = [

  // english
  'the',
  'of',
  'and',
  'or',
  'for',
  'to',
  'with',
  'without',
  'thanks to',
  'by',
  'those',
  'but',
  'she',
  'he',
  'they',
  'it',
  'is',
  'are',
  'between',

  // french
  'les?',
  'las?',
  'des?',
  'et',
  'ou',
  'pour',
  'avec',
  'sans',
  '(?:grâce )?(?:aux?|à)',
  'par',
  '(?:lequel|laquelle|lesquelles|lesquels)',
  'mais',
  'ils?',
  'elles?',
  'entre',
]

const trimLeftR  = new RegExp(`^(?:${trimLeft.join('|')})$`, 'i')
const trimRightR = new RegExp( `^(?:${trimRight.join('|')})$`, 'i')

function trimTransitionWords (txt) {

  txt = typeof txt === 'string' ? txt : ''

  const leftWords = txt.split(' ')
  const leftResults = leftWords.slice()

  for (let i = 0, word = ''; i < leftWords.length; i++) {
    const word = leftWords[i].trim()
    trimLeftR.lastIndex = 0
    if (word === '') { leftResults.shift() }
    if (word.match(trimLeftR) !== null) {
      leftResults.shift()
    } else {
      break
    }
  }

  const rightResults = leftResults.slice()

  for (let i = leftResults.length - 1, word = ''; i > 0; i--) {
    const word = leftResults[i].trim()
    trimRightR.lastIndex = 0
    if (word === '') { rightResults.pop() }
    if (word.match(trimRightR) !== null) {
      rightResults.pop()
    } else {
      break
    }
  }

  return rightResults.join(' ')
}

module.exports = trimTransitionWords
