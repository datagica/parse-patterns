'use strict'

const { Sentence } = require('../core/core')
const extract      = require('./extract')
const concept      = require('../entities/concept')

function link (r) { return Object.assign({}, r, { link: concept(r.link) }) }

function build (opts) {
  //console.log("build: "+JSON.stringify(opts, null, 2))

  return function (sentence, entities, locale) {

    // our pattern always expect a space at the beginning to simplify some other
    // parts of the code. It messes up with our measures, but that's better than
    // nothing.
    sentence = ` ${sentence}`

    const position = {
      sentence: 0,
      word: 0,
      begin: 0,
      end: 0
    }

    const pattern =  Sentence(opts.pattern)
    pattern.lastIndex = 0

    let promises = []
    let match

    while (match = pattern.exec(sentence)) {
      promises = promises.concat([
        extract(match.slice(1), sentence, position, entities, locale).then(match => {
          const res = opts.rule(
            match[0],
            match[1],
            match[2],
            match[3],
            match[4],
            match[5]
          )
          if (Array.isArray(res) && res.length) {
            return res.map(r => link(r))
          }

          if (res) {
            return link(res)
          }
          return null
        })
      ])
    }

    return Promise.all(promises)
  }
}


module.exports = build
