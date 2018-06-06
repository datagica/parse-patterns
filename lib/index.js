'use strict'

const patterns = require('./patterns/index')

/**
 * Parse a text to find pattern between entities
 * the entities array should only contain entities that are in the text
 * because it's better if we don't have to check the sentence id
 */
function parse (input, entities, locale) {

  entities = Array.isArray(entities) ? entities.slice() : []

  return patterns.reduce((prom, pattern) => prom.then(acc =>
    pattern(input, entities, locale).then(result => {
      if (acc.length || !result) { return Promise.resolve(acc) }
      return Promise.resolve(acc.concat(result))
    })
  ), Promise.resolve([]))
}

module.exports         = parse
module.exports.parse   = parse
module.exports.default = parse
