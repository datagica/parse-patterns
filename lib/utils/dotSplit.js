'use strict'

const trim = require('./trim')

// rule:
// "john.doe john. john j. doe john.".replace(/(?:([^ ][a-z])| )\. /g, "$1CUT").split('CUT')
const dotSplitP = new RegExp(/(?:([^ ][<>&#@A-Za-z0-9\\-éè'öüïäëâêûîô])| )\. /g)

function dotSplit(txt) {
  // smart split, preserving words such as "John F. Kennedy was..", "x@y.com", or "R.I.P"
  // note that we add some extra fake padding, in order to detect end dots such as "He moved to Chicago."
  return ` ${txt} `.replace(dotSplitP, "$1⛓⛓⛓").split("⛓⛓⛓").map(x => trim(x))
}

module.exports = dotSplit
