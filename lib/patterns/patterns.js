const { Words, Maybe, Always, GetMaybe, GetAlways } = require("../core/core")

const normalize = require('../utils/normalize')
const Adverb = require('../core/adverb')

const Pronoun = [

  // english
  "some",
  "the",
  "this",
  "these",
  "an?",

  // french
  "une?",
  "les?",
  "la",
  "du",
  "des",

  // spanish
  "los",
  "las"
]

const Time = [
  "yesterday(?: (?:morning|evening))?",
  "hier(?: (?:soir|matin))?",
  "aujourd'hui",
  "this(?: (?:evening|morning))"
]


/*

const parts = []
Object.keys(languages).map(lang => {

  // some re-usable sentence building blocks
  const passEnA = `(?:(?:have|has) been|was|were)`
  const passFRA = `(?:"(?:a|ont) [eé]t[eé]|(?:se sont|s'est) faite?)`
  const passFrB = `(?: par)?`,
  const passEnB = `(?: by)?`
  switch (lang) {
    case 'en':
      const ``
      parts.push()
      break;
    case 'en':

      break;
  }
})
*/

// a rule in the form "AAA did BBB by CCC"
function ActiveForm ({ link, action }) {
  return {
    pattern: [
      Maybe(Pronoun),
      GetAlways(Words(5, true)),
      Maybe(Adverb),
      Maybe(normalize([
          "an?",
          "est",
          "va",
          "ira",
          "ont",
          "has",
          "have",
          "is",
          "was",
          "were"
        ])),
      Maybe(Adverb),
      Maybe(normalize([
        "being",
        "been",
        "été",
        "est",
        "ont",
        "en train(?: d'être|de)?"
      ])),
      Maybe(Adverb),
      Always(normalize(action)),
      Maybe(Adverb),
      Maybe(Pronoun),
      GetMaybe(Words(5, false)),
      GetMaybe(Time)
    ],
    rule: (source, target, time) => Object.assign({
      source: source ? source : null,
      target: target ? target : null,
      link: link
    }, time ? { date: time } : {})
  }
}

// a rule in the form "AAA has been BBB by CCC"
function PassiveForm ({ link, action }) {
  return {
    pattern: [
      Maybe(Pronoun),
      GetAlways(Words(5, true)),
      Maybe(Adverb),
      Maybe(normalize([
          "an?",
          "sont",
          "est",
          "s'est",
          "se sont",
          "ont",
          "se",
          "has",
          "have",
          "is",
          "are",
          "was",
          "were"
        ])),
      Maybe(Adverb),
      Always(normalize([
        "being",
        "been",
        "made",
        "rendered",
        "été",
        "est",
        "ont",
        "rendue?s?",
        "en train(?: d'être|de(?: se faire)?)?",
        "vue?s?",
        "faire",
        "faite"
      ])),
      Maybe(Adverb),
      Always(normalize(action)),
      Maybe(Adverb),
        `(?:`
        + Always(["par", "by", "to", "à", "aux"])
        + Maybe(Pronoun)
        + GetAlways(Words(5, false))
        + `)?`,
       GetMaybe(Time)
    ],
    rule: (target, source, time) => Object.assign({
      source: source ? source : null,
      target: target ? target : null,
      link: link
    }, time ? { date: time } : {})
  }
}

module.exports = {
  ActiveForm: ActiveForm,
  PassiveForm: PassiveForm,
  Pronoun: Pronoun,
  Time: Time
}
