export const bvmValidServerData = {
    "data": {
        "elements": [
            {
                "sectionHandle": "chemicalElement",
                "typeHandle": "chemicalElement",
                "number": "1",
                "symbol": "H",
                "gallery": [],
                "name_en": "Hydrogen"
              },
              {
                "sectionHandle": "chemicalElement",
                "typeHandle": "chemicalElement",
                "number": "2",
                "symbol": "He",
                "gallery": [],
                "name_en": "Helium"
              },
              {
                "sectionHandle": "chemicalElement",
                "typeHandle": "chemicalElement",
                "number": "3",
                "symbol": "Li",
                "gallery": [
                  {
                    "typeHandle": "entry",
                    "text_en": null
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": "Something else…"
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": "Katt"
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": null
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": "Lithium salt… is that a thing"
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": "Lithium stone"
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": "Lithium production"
                  },
                  {
                    "typeHandle": "entry",
                    "text_en": null
                  }
                ],
                "name_en": "Lithium"
              },
        ],
        "filters": [
            {
                "sectionHandle": "elementFilter",
                "typeHandle": "elementFilter",
                "filterName": "Human Molecules",
                "filterId": "hum-mol",
                "video": [
                  {
                    "url": "https://geolabcms.no/assets/human-body.m4v"
                  }
                ]
              },
              {
                "sectionHandle": "elementFilter",
                "typeHandle": "elementFilter",
                "filterName": "Glowing Gases",
                "filterId": "glow-gas",
                "video": [
                  {
                    "url": "https://geolabcms.no/assets/glowing-gases.mp4"
                  }
                ]
              },
        ],
        "mainGlobal": [
            {
              "handle": "main",
              "bottomRowConnectorAdjustments": [
                {
                  "typeHandle": "shift",
                  "xBox": "0",
                  "yBox": "0"
                },
                {
                  "typeHandle": "shift",
                  "xBox": "0",
                  "yBox": "0"
                }
              ]
            }
          ]
    }
}

export const bvmCorrectExtractedData = {
    "elements": [
        {
            "sectionHandle": "chemicalElement",
            "typeHandle": "chemicalElement",
            "number": 1,
            "symbol": "H",
            "gallery": undefined,
            "name": "Hydrogen"
        },
        {
            "sectionHandle": "chemicalElement",
            "typeHandle": "chemicalElement",
            "number": 2,
            "symbol": "He",
            "gallery": undefined,
            "name": "Helium"
        },
        {
            "sectionHandle": "chemicalElement",
            "typeHandle": "chemicalElement",
            "number": 3,
            "symbol": "Li",
            "gallery": [
                {
                "typeHandle": "entry",
                "text": undefined
                },
                {
                "typeHandle": "entry",
                "text": "Something else…"
                },
                {
                "typeHandle": "entry",
                "text": "Katt"
                },
                {
                "typeHandle": "entry",
                "text": undefined,
                },
                {
                "typeHandle": "entry",
                "text": "Lithium salt… is that a thing"
                },
                {
                "typeHandle": "entry",
                "text": "Lithium stone"
                },
                {
                "typeHandle": "entry",
                "text": "Lithium production"
                },
                {
                "typeHandle": "entry",
                "text": undefined,
                }
            ],
            "name": "Lithium"
        },
    ],
    "filters": [
        {
            "sectionHandle": "elementFilter",
            "typeHandle": "elementFilter",
            "filterName": "Human Molecules",
            "filterId": "hum-mol",
            "video": [
                {
                "url": "https://geolabcms.no/assets/human-body.m4v"
                }
            ]
            },
            {
            "sectionHandle": "elementFilter",
            "typeHandle": "elementFilter",
            "filterName": "Glowing Gases",
            "filterId": "glow-gas",
            "video": [
                {
                "url": "https://geolabcms.no/assets/glowing-gases.mp4"
                }
            ]
            },
    ],
    "mainGlobal": 
        {
            "handle": "main",
            "bottomRowConnectorAdjustments": [
            {
                "typeHandle": "shift",
                "xBox": 0,
                "yBox": 0
            },
            {
                "typeHandle": "shift",
                "xBox": 0,
                "yBox": 0
            }
            ]
        }
}