'use strict'

const notInteresting = require('./notInteresting.json')

const notInterestingR = {}
Object.keys(notInteresting).map(locale => {
  notInterestingR[locale] = new RegExp(`^(?:${notInteresting[locale].join('|')})$`, 'gi')
})

function isInteresting (entity, locale) {
  if (!notInterestingR[locale]) {
    locale = 'en'
  }

  const localized = notInterestingR[locale]

  localized.lastIndex = 0

  const txt = entity.entity.trim()

  if (txt.match(localized) !== null) {
    return false
  }

  const words = txt.split(' ')

  // too many words
  //if (words.length > 3) {
  //  return false
  //}

  return true
}

module.exports = isInteresting
