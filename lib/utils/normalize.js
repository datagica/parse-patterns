'use strict'

const normalizeOne = i => (
    `${i}`
    .replace(/([èéêë])/gi, '[e$1]')
    .replace(/([âàä])/gi, '[a$1]')
    .replace(/([ïî])/gi, '[i$1]')
    .replace(/([ûü])/gi, '[u$1]')
    .replace(/([ôö])/gi, '[o$1]')
)

const normalize = i => Array.isArray(i) ? i.map(j => normalizeOne(j)) : normalizeOne(i)

module.exports = normalize
