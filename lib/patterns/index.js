'use strict'

const { links } = require('@datagica/ontology')
const compile = require("./compile")

module.exports = compile(links)
