'use strict'

const Ontology = require('@datagica/ontology')

// Try to resolve a string to a concept, if it doesn't work, prepend 'link:'
// before doing the search. If nothing works, we return what use user gave us.
const concept = i => (typeof i === 'string' && (Ontology.map[i] || Ontology.map['link:'+i])) || i

module.exports = concept
concept.concepts = Ontology.map
