'use strict'

const word = require('./word')

const UNKNOW   = 'unknow'
const SKIP     = 'skip'

const space    = `\\s+`

const prepare = i => (
  `${i}`.replace(/ +/gi, '\\s+')
)

const Wrap     = i => '(?:' + (Array.isArray(i) ? i.map(j => prepare(j)).join('|') : `${prepare(i)}`) + ')'
const Has      = i => '(?:' + space + Wrap(i) +')'

const Always = i => `(?:${space}${Wrap(i)})`
const Maybe  = i => Always(i) + '?'

// matching group to extract a value
const GetAlways = i => `(?:${space}(${Wrap(i)}))`
const GetMaybe  = i => GetAlways(i) + '?'

// matches a sequence of words - the really important bit here is the "}?"
// for non-greedy range matching
const Words = (max, nonGreedy) => (
  word() + (
    max <= 1 ? '' : `(?:${space}${word()}){0,${max > 2 ? max : ''}}${nonGreedy ? '?' : ''}`
  )
)


// join patterns into a sentence
const Sentence = words => new RegExp(words.join(''), 'g')

module.exports = {
  UNKNOW: UNKNOW,
  SKIP: SKIP,
  space: space,
  Maybe: Maybe,
  Always: Always,
  GetMaybe: GetMaybe,
  GetAlways: GetAlways,
  Sentence: Sentence,
  Words: Words
}
