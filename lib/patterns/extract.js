'use strict'

const parseGenericEntity = require('@datagica/parse-generic-entity')

const trimTransitionWords = require('../heuristics/trimTransitionWords')
const isInteresting = require('../heuristics/isInteresting')
const toId = require('../utils/toId')
const findPosition = require('../utils/findPosition')

/**
 * Convert raw regex matches into pretty entities
 */
async function extract (matches, sentence, parentPosition, entities, locale) {

  const DISABLE_GENERICS_FOR_THE_DEMO = true

  const results = [] // promise array

  for (let i = 0; i < matches.length; i++) {

    if (!matches[i]) {
      continue
    }
    const match = trimTransitionWords(matches[i])

    const position = findPosition(sentence, match, parentPosition)

    if (!match || match === 'undefined' || match === 'null') {
      continue
    }

    let entity

    // note: for the moment, we use a non-efficient algorithm
    // later we could use utils/intervalTree.js for faster lookup
    // console.log("searching into "+JSON.stringify(entities, null, 2))
    for (let j = 0; j < entities.length; j++) {
      const candidate = entities[j]
      // console.log("position: "+JSON.stringify(position, null, 2))
      if (!candidate) { continue }

      // check if the entity is inside the range of our match
      if (position && candidate.position && position.begin <= candidate.position.begin && candidate.position.end <= position.end) {
        entity = candidate
        entities[j] = null
      }

    }

    let promise

    if (entity) {
      results.push(entity)
    } else {
      // console.log("match: "+match)
      const value = await parseGenericEntity(match, locale)
      // console.log("DEBUG: " + JSON.stringify(value, null, 2));

      if (isInteresting(value, locale)) {
        results.push({
          position: Object.assign({
            ...position,
            ngram: match,
            score: 1.0, // yeah, basic scoring algorithm for now
          }),
          entity: Object.assign({
            ...value,
            id: `entity:generic__${value.id}`
          })
        })
      }
    }
  }

  return results
}

module.exports = extract
