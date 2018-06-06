'use strict'

const build = require('./build')

const { ActiveForm, PassiveForm } = require('./patterns')

function compile (links) {

  const list = []

  links.map(link => {

    if (!link.match) { return }

    // check patterns of the form "A has been found by B" first
    if (Array.isArray(link.match.passive) && link.match.passive.length) {
      list.unshift(build(PassiveForm({ link: link, action: link.match.passive })))
    }

    // "A found B" is also part of the passive form, so we do it in last
    if (Array.isArray(link.match.active) && link.match.active.length) {
      list.push(build(ActiveForm({ link: link, action: link.match.active })))
    }
  })

  return list
}

module.exports = compile
