const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const trimTransitionWords = require("../lib/heuristics/trimTransitionWords")
const isInteresting = require("../lib/heuristics/isInteresting")

const parse = require("../lib/index")

describe("@datagica/parse-patterns", () => {

  it('should trim transition words', (done) => {
    const tests = [
      {
        input: "and he is here for",
        output: "he is here"
      }, {
        input: "et il est là pour",
        output: "il est là"
      },
      {
        input: "et on",
        output: "on"
      }
    ]

    tests.map(({input, output}) => {
      expect(trimTransitionWords(input)).to.be.like(output)
    })

    done()
  })

  it('should check is an entity is interesting', (done) => {
    const tests = [
      {
        input: {
          id: "entity:generic__google",
          label: {
            en: "Google"
          },
          description: {
            en: "Google"
          },
          entity: "Google",
          gender: "female",
          number: "singular"
        },
        output: true
      }, {
        input: {
          id: "entity:generic__on",
          label: {
            en: "on"
          },
          description: {
            en: "on"
          },
          entity: "on",
          gender: "male",
          number: "singular"
        },
        output: false // because blacklisted
      },
      {
        input: {
          id: "entity:generic__google_has_been_recently",
          label: {
            en: "Google has been recently"
          },
          description: {
            en: "Google has been recently"
          },
          entity: "Google has been recently",
          gender: "female",
          number: "singular"
        },
        // FIXME should be false, because this contains another verb
        output: true
      }
    ]

    tests.map(({input, output}) => {
      expect(isInteresting(input)).to.be.like(output)
    })

    done()
  })

  it('should parse facts written in english', (done) => {
    Promise.all([
      {
        input: "Breaking news: Google buys IBM!",
        output: [
          {
            source: {
              position: {
                ngram: "Google",
                score: 1,
                sentence: 0,
                word: 1,
                begin: 15,
                end: 21
              },
              entity: {
                id: "entity:generic__google",
                label: {
                  en: "Google"
                },
                description: {
                  en: "Google"
                },
                entity: "Google",
                gender: "female",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "IBM",
                score: 1,
                sentence: 0,
                word: 3,
                begin: 27,
                end: 30
              },
              entity: {
                id: "entity:generic__ibm",
                label: {
                  en: "IBM"
                },
                description: {
                  en: "IBM"
                },
                entity: "IBM",
                gender: "neutral",
                number: "singular"
              }
            },
            link: {
              type: "purchase",
              id: "link:purchase",
              label: {
                en: "Purchase",
                fr: "Achat"
              },
              plural: {
                en: "Purchases",
                fr: "Achats"
              },
              description: {
                en: "Corporate or consumer purchases",
                fr: "Achats et acquisitions"
              },
              aliases: {
                en: [
                  "purchase", "purchases"
                ],
                fr: ["achat", "achats", "acquisition", "acquisitions"]
              },
              match: {
                "active": [
                  "bought",
                  "purchase[ds]?",
                  "acquire[ds]?",
                  "buys?",
                  "buying",
                  "acqui[st]",
                  "(?:r)?achète(?:nt)?",
                  "acquiert"
                ],
                "passive": ["bought", "acquired", "purchased", "(?:r)?achetée?s?"]
              }
            }
          }
        ]
      }, {
        input: "IBM has been acquired by Google",
        output: [
          {
            link: {
              aliases: {
                en: [
                  "purchase", "purchases"
                ],
                fr: ["achat", "achats", "acquisition", "acquisitions"]
              },
              description: {
                en: "Corporate or consumer purchases",
                fr: "Achats et acquisitions"
              },
              id: "link:purchase",
              label: {
                en: "Purchase",
                fr: "Achat"
              },
              plural: {
                en: "Purchases",
                fr: "Achats"
              },
              type: "purchase",
              match: {
                "active": [
                  "bought",
                  "purchase[ds]?",
                  "acquire[ds]?",
                  "buys?",
                  "buying",
                  "acqui[st]",
                  "(?:r)?achète(?:nt)?",
                  "acquiert"
                ],
                "passive": ["bought", "acquired", "purchased", "(?:r)?achetée?s?"]
              }
            },
            source: {
              position: {
                ngram: "Google",
                score: 1,
                begin: 25,
                end: 31,
                sentence: 0,
                word: 4
              },
              entity: {
                id: "entity:generic__google",
                label: {
                  en: "Google"
                },
                description: {
                  en: "Google"
                },
                entity: "Google",
                gender: "female",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "IBM",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 0,
                end: 3
              },
              entity: {
                id: "entity:generic__ibm",
                label: {
                  en: "IBM"
                },
                description: {
                  en: "IBM"
                },
                entity: "IBM",
                gender: "neutral",
                number: "singular"
              }
            }
          }
        ]
      }, {
        input: "some evidence has been found by Scully",
        output: [
          {
            source: {
              position: {
                ngram: "Scully",
                score: 1,
                sentence: 0,
                word: 5,
                begin: 32,
                end: 38
              },
              entity: {
                id: "entity:generic__scully",
                label: {
                  en: "Scully"
                },
                description: {
                  en: "Scully"
                },
                entity: "Scully",
                gender: "neutral",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "evidence",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 5,
                end: 13
              },
              entity: {
                id: "entity:generic__evidence",
                label: {
                  en: "evidence"
                },
                description: {
                  en: "evidence"
                },
                entity: "evidence",
                gender: "female",
                number: "singular"
              }
            },
            link: {
              type: "discovery",
              id: "link:discovery",
              label: {
                en: "Discovery",
                fr: "Découverte"
              },
              plural: {
                en: "Discoveries",
                fr: "Découvertes"
              },
              description: {
                en: "One or more discoveries",
                fr: "Découverte(s)"
              },
              aliases: {
                en: [
                  "discovery",
                  "discoveries",
                  "discover",
                  "discovers",
                  "find",
                  "finds",
                  "finding"
                ],
                fr: [
                  "découverte",
                  "découvertes",
                  "découvre",
                  "découvrent",
                  "trouve",
                  "trouvent"
                ]
              },
              match: {
                "active": [
                  "découverte?s?", "(?:re)?trouvée?s?", "finds?", "found", "discover(?:s|ed)?"
                ],
                "passive": ["découverte?s?", "(?:re)?trouvée?s?", "found", "discovered"]
              }
            },

          }
        ]
      }, {
        input: "large segments of the border wall has been destroyed",
        entities: [],
        output: [
          {
            source: null,
            target: {
              position: {
                ngram: "large segments of the border wall",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 0,
                end: 33
              },
              entity: {
                id: "entity:generic__large-segments-of-the-border-wall",
                label: {
                  en: "large segments of the border wall"
                },
                description: {
                  en: "large segments of the border wall"
                },
                entity: "segments of the border wall",
                size: "big",
                gender: "male",
                number: "plural"
              }
            },
            link: {
              "aliases": {
                en: ["destruction", "destructions"]
              },
              description: {
                en: "Destruction",
                "fr": "Destruction"
              },
              id: "link:destruction",
              label: {
                en: "Destruction",
                "fr": "Destruction"
              },
              match: {
                "passive": ["détruite?s?", "destroyed"]
              },
              plural: {
                en: "Destructions",
                "fr": "Destructions"
              },
              type: "link"
            },

          }
        ]
      }, {
        input: "A dog must not misbehave",
        entities: [],
        output: [
  {
    "source": {
      "position": {
        "sentence": 0,
        "word": 0,
        "begin": 2,
        "end": 5,
        "ngram": "dog",
        "score": 1
      },
      "entity": {
        "id": "entity:generic__dog",
        "label": {
          "en": "dog"
        },
        "description": {
          "en": "dog"
        },
        "entity": "dog",
        "number": "singular",
        "gender": "neutral"
      }
    },
    "target": {
      "position": {
        "sentence": 0,
        "word": 3,
        "begin": 15,
        "end": 24,
        "ngram": "misbehave",
        "score": 1
      },
      "entity": {
        "id": "entity:generic__misbehave",
        "label": {
          "en": "misbehave"
        },
        "description": {
          "en": "misbehave"
        },
        "entity": "misbehave",
        "number": "singular",
        "gender": "neutral"
      }
    },
    "link": {
      "type": "link",
      "id": "link:must-not",
      "label": {
        "en": "Must not",
        "fr": "Ne doit pas"
      },
      "plural": {
        "en": "Must not",
        "fr": "Ne doivent pas"
      },
      "description": {
        "en": "Must not",
        "fr": "Ne doit pas"
      },
      "aliases": {
        "en": [
          "must not"
        ],
        "fr": [
          "ne doit pas",
          "doit pas"
        ]
      },
      "match": {
        "active": [
          "must not",
          "ne devait pas",
          "ne doit pas",
          "ne doivent pas",
          "ne devait",
          "ne doit",
          "ne doivent",
          "devait pas",
          "doit pas",
          "doivent pas"
        ],
        "passive": []
      }
    }
  }
]
      }, {
        input: "the prime minister came under fire for a tweet",
        entities: [],
        output: []
      }

    ].map(test => {
      return parse(test.input, test.entities).then(output => {
        //console.log("\n\ninput: "+test.input+"\noutput: " + JSON.stringify(output, null, 2)+"\nexpected: "+JSON.stringify(test.output, null, 2))
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })
    })).then(finished => {
      done()
    }).catch(err => done(err))
  })

  it('should parse facts written in english using an entity list', (done) => {
    Promise.all([
      {
        input: "the suspect has bought an ak-47 on the black market",
        entities: [
          {
            position: {
              ngram: "ak-47",
              score: 1,
              begin: 26,
              end: 31,
              sentence: 0,
              word: 5
            },
            entity: {
              aliases: {
                en: ["AK-47"]
              },
              category: "assault rifle",
              description: {
                en: "Union of Soviet Socialist Republics - Mikhail Kalashnikov - 1946-1948 - Assault Rifle - 7.62×39mm: Considered to be the first assault rifle ever mass-produced."
              },
              id: "weapon:AK-47",
              label: {
                en: "AK-47"
              }
            }
          }
        ],
        output: [
          {
            source: {
              position: {
                ngram: "suspect",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 4,
                end: 11
              },
              entity: {
                id: "entity:generic__suspect",
                label: {
                  en: "suspect"
                },
                description: {
                  en: "suspect"
                },
                entity: "suspect",
                gender: "neutral",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "ak-47",
                score: 1,
                begin: 26,
                end: 31,
                sentence: 0,
                word: 5
              },
              entity: {
                aliases: {
                  en: ["AK-47"]
                },
                category: "assault rifle",
                description: {
                  en: "Union of Soviet Socialist Republics - Mikhail Kalashnikov - 1946-1948 - Assault Rifle - 7.62×39mm: Considered to be the first assault rifle ever mass-produced."
                },
                id: "weapon:AK-47",
                label: {
                  en: "AK-47"
                }
              }
            },
            link: {
              type: "purchase",
              id: "link:purchase",
              label: {
                en: "Purchase",
                fr: "Achat"
              },
              plural: {
                en: "Purchases",
                fr: "Achats"
              },
              description: {
                en: "Corporate or consumer purchases",
                fr: "Achats et acquisitions"
              },
              aliases: {
                en: [
                  "purchase", "purchases"
                ],
                fr: ["achat", "achats", "acquisition", "acquisitions"]
              },

              match: {
                "active": [
                  "bought",
                  "purchase[ds]?",
                  "acquire[ds]?",
                  "buys?",
                  "buying",
                  "acqui[st]",
                  "(?:r)?achète(?:nt)?",
                  "acquiert"
                ],
                "passive": ["bought", "acquired", "purchased", "(?:r)?achetée?s?"]
              }
            }
          }
        ]
      },
      {
       input: "this national french company's stock has been raided by an american company",
       entities: [],
       output: [
         {
           link: {
             "aliases": {
               en: [
                 "attack",
                 "attacks",
                 "attacking",
                 "attacked",
                 "assault",
                 "assaulting",
                 "assaults"
               ],
               "fr": ["attaque", "attaquer", "attaques"]
             },
             description: {
               en: "Attack",
               "fr": "Attaque"
             },
             id: "link:attack",
             label: {
               en: "Attack",
               "fr": "Attaque"
             },
             match: {
               "passive": [
                 "attacked",
                 "assaulted",
                 "(?:(?:comes?|came|coming) )?under fire",
                 "bombarded",
                 "raided",
                 "prise?s? d'assaut",
                 "attaquée?s?",
                 "bombardée?s?"
               ]
             },
             plural: {
               en: "Attacks",
               "fr": "Attaques"
             },
             type: "link"
           },
           source: {
             position: {
               ngram: "american company",
               score: 1,
               begin: 59,
               end: 75,
               sentence: 0,
               word: 9
             },
             entity: {
               id: "entity:generic__american-company",
               label: {
                 en: "american company"
               },
               description: {
                 en: "american company"
               },
               entity: "company",
               gender: "neutral",
               number: "singular",
               "nationality": "american"
             }
           },
           target: {
             position: {
               ngram: "national french company's stock",
               score: 1,
               begin: 5,
               end: 36,
               sentence: 0,
               word: 0
             },
             entity: {
               id: "entity:generic__national-french-company's-stock",
               label: {
                 en: "national french company's stock"
               },
               description: {
                 en: "national french company's stock"
               },
               entity: "national  company's stock",
               "nationality": "french",
               gender: "male",
               number: "singular"
             }
           }
         }
       ]
     }, {
       input: "Nuclear powerplants running Windows XP are vulnerable to a cyber war worm",
       entities: [],
       output: []
     }
    ].map(test => {
      return parse(test.input, test.entities).then(output => {
        // console.log("\n\ninput: "+test.input+"\noutput: " + JSON.stringify(output, null, 2)+"\nexpected: "+JSON.stringify(test.output, null, 2))
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })
    })).then(finished => {
      done()
    }).catch(err => done(err))
  })

  it('should parse facts written in french', (done) => {
    Promise.all([
      {
        input: "des documents ont été retrouvés par notre agent",
        output: [
          {
            source: {
              position: {
                ngram: "notre agent",
                score: 1,
                sentence: 0,
                word: 5,
                begin: 36,
                end: 47
              },
              entity: {
                id: "entity:generic__notre-agent",
                label: {
                  en: "notre agent"
                },
                description: {
                  en: "notre agent"
                },
                entity: "notre agent",
                gender: "neutral",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "documents",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 4,
                end: 13
              },
              entity: {
                id: "entity:generic__documents",
                label: {
                  en: "documents"
                },
                description: {
                  en: "documents"
                },
                entity: "documents",
                gender: "male",
                number: "plural"
              }
            },
            link: {
              type: "discovery",
              id: "link:discovery",
              label: {
                en: "Discovery",
                "fr": "Découverte"
              },
              plural: {
                en: "Discoveries",
                "fr": "Découvertes"
              },
              description: {
                en: "One or more discoveries",
                "fr": "Découverte(s)"
              },
              "aliases": {
                en: [
                  "discovery",
                  "discoveries",
                  "discover",
                  "discovers",
                  "find",
                  "finds",
                  "finding"
                ],
                "fr": [
                  "découverte",
                  "découvertes",
                  "découvre",
                  "découvrent",
                  "trouve",
                  "trouvent"
                ]
              },
              match: {
                "active": [
                  "découverte?s?", "(?:re)?trouvée?s?", "finds?", "found", "discover(?:s|ed)?"
                ],
                "passive": ["découverte?s?", "(?:re)?trouvée?s?", "found", "discovered"]
              }
            }
          }
        ]
      }, {
        input: "des documents ont été retrouvés par hasard par l'agent secret.",
        output: [
          {
            source: {
              position: {
                ngram: "l'agent secret",
                score: 1,
                begin: 47,
                end: 61,
                sentence: 0,
                word: 7
              },
              entity: {
                id: "entity:generic__l'agent-secret",
                label: {
                  en: "l'agent secret"
                },
                description: {
                  en: "l'agent secret"
                },
                entity: "l'agent secret",
                gender: "male",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "documents",
                score: 1,
                sentence: 0,
                word: 0,
                begin: 4,
                end: 13
              },
              entity: {
                id: "entity:generic__documents",
                label: {
                  en: "documents"
                },
                description: {
                  en: "documents"
                },
                entity: "documents",
                gender: "male",
                number: "plural"
              }
            },
            link: {
              type: "discovery",
              id: "link:discovery",
              label: {
                en: "Discovery",
                fr: "Découverte"
              },
              plural: {
                en: "Discoveries",
                fr: "Découvertes"
              },
              description: {
                en: "One or more discoveries",
                fr: "Découverte(s)"
              },
              aliases: {
                en: [
                  "discovery",
                  "discoveries",
                  "discover",
                  "discovers",
                  "find",
                  "finds",
                  "finding"
                ],
                fr: [
                  "découverte",
                  "découvertes",
                  "découvre",
                  "découvrent",
                  "trouve",
                  "trouvent"
                ]
              },
              match: {
                "active": [
                  "découverte?s?", "(?:re)?trouvée?s?", "finds?", "found", "discover(?:s|ed)?"
                ],
                "passive": ["découverte?s?", "(?:re)?trouvée?s?", "found", "discovered"]
              }
            }
          }
        ]
      }, {
        input: "la grande barrière de corail est en train d'être détruite",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: ["destruction", "destructions"]
              },
              description: {
                en: "Destruction",
                "fr": "Destruction"
              },
              id: "link:destruction",
              label: {
                en: "Destruction",
                "fr": "Destruction"
              },
              match: {
                "passive": ["détruite?s?", "destroyed"]
              },
              plural: {
                en: "Destructions",
                "fr": "Destructions"
              },
              type: "link"
            },
            source: null,
            target: {
              position: {
                ngram: "grande barrière de corail",
                score: 1,
                begin: 3,
                end: 28,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__grande-barrière-de-corail",
                label: {
                  en: "grande barrière de corail"
                },
                description: {
                  en: "grande barrière de corail"
                },
                entity: "barrière de corail",
                gender: "female",
                number: "singular",
                size: "big"
              }
            }
          }
        ]
      }, {
        input: "la grande barrière de corail est en train d'être progressivement détruite",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: ["destruction", "destructions"]
              },
              description: {
                en: "Destruction",
                "fr": "Destruction"
              },
              id: "link:destruction",
              label: {
                en: "Destruction",
                "fr": "Destruction"
              },
              match: {
                "passive": ["détruite?s?", "destroyed"]
              },
              plural: {
                en: "Destructions",
                "fr": "Destructions"
              },
              type: "link"
            },
            source: null,
            target: {
              position: {
                ngram: "grande barrière de corail",
                score: 1,
                begin: 3,
                end: 28,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__grande-barrière-de-corail",
                label: {
                  en: "grande barrière de corail"
                },
                description: {
                  en: "grande barrière de corail"
                },
                entity: "barrière de corail",
                gender: "female",
                number: "singular",
                size: "big"
              }
            }
          }
        ]
      }, {
        input: "Le parquet a ouvert une enquête contre la société Jean Bon",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: [
                  "Investigation", "Investigations", "Inquiry", "Inquiries"
                ],
                "fr": [
                  "Enquête",
                  "Enquêtes",
                  "Enquete",
                  "Enquetes",
                  "Investigation",
                  "Investigations"
                ]
              },
              description: {
                en: "Investigation",
                "fr": "Enquête"
              },
              id: "link:investigation",
              label: {
                en: "Investigation",
                "fr": "Enquête"
              },
              match: {
                "active": ["ouv(?:re(?:nt)?|erte?s?) (?:une|plusieurs) (?:investigation|enquête)s?(?: (?:contre|sur|auprès des?))?", "(?:order(?:s|ing|ed)?|open(?:ed|ing|s?)?)(?: (?:an|multiples?|a new))? (?:inquir(?:y|ies)|investigations?)"]
              },
              plural: {
                en: "Investigations",
                "fr": "Enquêtes"
              },
              type: "link"
            },
            source: {
              position: {
                ngram: "Le parquet",
                score: 1,
                begin: 0,
                end: 10,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__le-parquet",
                label: {
                  en: "Le parquet"
                },
                description: {
                  en: "Le parquet"
                },
                entity: "Le parquet",
                gender: "male",
                number: "singular"
              }
            },
            target: {
              position: {
                ngram: "société Jean Bon",
                score: 1,
                begin: 42,
                end: 58,
                sentence: 0,
                word: 7
              },
              entity: {
                id: "entity:generic__société-jean-bon",
                label: {
                  en: "société Jean Bon"
                },
                description: {
                  en: "société Jean Bon"
                },
                entity: "société Jean Bon",
                gender: "female",
                number: "singular"
              }
            }
          }
        ]
      }, {
        input: "Le passager s'est vu refuser l'embarquement au motif que l'avion était surbooké",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: [
                  "denial", "denials"
                ],
                "fr": ["refus"]
              },
              description: {
                en: "Denial",
                "fr": "Refus"
              },
              id: "link:denial",
              label: {
                en: "Denial",
                "fr": "Refus"
              },
              match: {
                "passive": [
                  "denied(?: to)?", "(?:(?:fai(?:s|re|te?)|v(?:oir|ue?s?)) )?refus(?:er|ée?s?)(?: de)?"
                ],
                "active": ["denied(?: to)?", "refus(?:er|ée?s?)(?: de)?"]
              },
              plural: {
                en: "Denials",
                "fr": "Refus"
              },
              type: "link"
            },
            target: {
              position: {
                ngram: "Le passager",
                score: 1,
                begin: 0,
                end: 11,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__le-passager",
                label: {
                  en: "Le passager"
                },
                description: {
                  en: "Le passager"
                },
                entity: "Le passager",
                gender: "male",
                number: "singular"
              }
            },
            source: null
          }
        ]
      }, {
        input: "la date de sortie a été changée",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: ["change"],
                "fr": ["changement"]
              },
              description: {
                en: "Change",
                "fr": "Changement"
              },
              id: "link:change",
              label: {
                en: "Change",
                "fr": "Changement"
              },
              match: {
                "passive": ["changed", "transformed", "changée?s?", "transformée?s?"]
              },
              plural: {
                en: "Changes",
                "fr": "Changements"
              },
              type: "link"
            },
            source: null,
            target: {
              position: {
                ngram: "date de sortie",
                score: 1,
                begin: 3,
                end: 17,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__date-de-sortie",
                label: {
                  en: "date de sortie"
                },
                description: {
                  en: "date de sortie"
                },
                entity: "date de sortie",
                gender: "neutral",
                number: "singular"
              }
            }
          }
        ]
      }, {
        input: "la date de sortie a finalement été changée",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: ["change"],
                "fr": ["changement"]
              },
              description: {
                en: "Change",
                "fr": "Changement"
              },
              id: "link:change",
              label: {
                en: "Change",
                "fr": "Changement"
              },
              match: {
                "passive": ["changed", "transformed", "changée?s?", "transformée?s?"]
              },
              plural: {
                en: "Changes",
                "fr": "Changements"
              },
              type: "link"
            },
            source: null,
            target: {
              position: {
                ngram: "date de sortie",
                score: 1,
                begin: 3,
                end: 17,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__date-de-sortie",
                label: {
                  en: "date de sortie"
                },
                description: {
                  en: "date de sortie"
                },
                entity: "date de sortie",
                gender: "neutral",
                number: "singular"
              }
            }
          }
        ]
      }, {
        input: "le nouveau concept-store a été pris d'assaut par les hipsters",
        entities: [],
        output: [
          {
            link: {
              "aliases": {
                en: [
                  "attack",
                  "attacks",
                  "attacking",
                  "attacked",
                  "assault",
                  "assaulting",
                  "assaults"
                ],
                "fr": ["attaque", "attaquer", "attaques"]
              },
              description: {
                en: "Attack",
                "fr": "Attaque"
              },
              id: "link:attack",
              label: {
                en: "Attack",
                "fr": "Attaque"
              },
              match: {
                "passive": [
                  "attacked",
                  "assaulted",
                  "(?:(?:comes?|came|coming) )?under fire",
                  "bombarded",
                  "raided",
                  "prise?s? d'assaut",
                  "attaquée?s?",
                  "bombardée?s?"
                ]
              },
              plural: {
                en: "Attacks",
                "fr": "Attaques"
              },
              type: "link"
            },
            source: {
              position: {
                ngram: "hipsters",
                score: 1,
                begin: 53,
                end: 61,
                sentence: 0,
                word: 8
              },
              entity: {
                id: "entity:generic__hipsters",
                label: {
                  en: "hipsters"
                },
                description: {
                  en: "hipsters"
                },
                entity: "hipsters",
                gender: "male",
                number: "plural"
              }
            },
            target: {
              position: {
                ngram: "nouveau concept-store",
                score: 1,
                begin: 3,
                end: 24,
                sentence: 0,
                word: 0
              },
              entity: {
                id: "entity:generic__nouveau-concept-store",
                label: {
                  en: "nouveau concept-store"
                },
                description: {
                  en: "nouveau concept-store"
                },
                entity: "concept-store",
                gender: "neutral",
                number: "singular",
                "age": "young"
              }
            }
          }
        ]
      }, {
        input: "la balle a manquée de justesse le ventricule gauche",
        entities: [],
        output: []
      }
    ].map(test => {
      return parse(test.input, test.entities).then(output => {
        // console.log("input: "+test.input+", output: " + JSON.stringify(output, null, 2))
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })
    })).then(finished => done()).catch(err => done(err))
  })

  it('should not parse non-interesting facts written in french', (done) => {
    Promise.all([
      {
        input: "on a retrouvé quelque chose",
        output: [
          {
            "target": null,
            "source": {
              "position": {
                "sentence": 0,
                "word": 2,
                "begin": 14,
                "end": 27,
                "ngram": "quelque chose",
                "score": 1
              },
              "entity": {
                "id": "entity:generic__quelque-chose",
                "label": {
                  "en": "quelque chose"
                },
                "description": {
                  "en": "quelque chose"
                },
                "entity": "quelque chose",
                "number": "singular",
                "gender": "female"
              }
            },
            "link": {
              "type": "discovery",
              "id": "link:discovery",
              "label": {
                "en": "Discovery",
                "fr": "Découverte"
              },
              "plural": {
                "en": "Discoveries",
                "fr": "Découvertes"
              },
              "description": {
                "en": "One or more discoveries",
                "fr": "Découverte(s)"
              },
              "aliases": {
                "en": [
                  "discovery",
                  "discoveries",
                  "discover",
                  "discovers",
                  "find",
                  "finds",
                  "finding"
                ],
                "fr": [
                  "découverte",
                  "découvertes",
                  "découvre",
                  "découvrent",
                  "trouve",
                  "trouvent"
                ]
              },
              "match": {
                "active": [
                  "découverte?s?", "(?:re)?trouvée?s?", "finds?", "found", "discover(?:s|ed)?"
                ],
                "passive": ["découverte?s?", "(?:re)?trouvée?s?", "found", "discovered"]
              }
            }
          }
        ]
      }
    ].map(test => {
      return parse(test.input, test.entities).then(output => {
        // console.log("input: " + test.input + ", output: " + JSON.stringify(output, null, 2))
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })
    })).then(finished => done()).catch(err => done(err))
  })

})
