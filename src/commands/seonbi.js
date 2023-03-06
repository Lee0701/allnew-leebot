
const p = require('phin')

const SEONBI_API_URL = process.env.SEONBI_API_URL

const labels = [
    'seonbi',
]

const argsOptions = {
    vertical: {
        type: 'boolean',
        short: 'v',
        default: false,
    },
}

const makeBody = (content, options) => {
    return {
        "contentType": "text/plain",
        "content": content,
        "quote": "CurvedQuotes",
        "cite": "AngleQuotes",
        "arrow": {
            "bidirArrow": true,
            "doubleArrow": true
        },
        "ellipsis": true,
        "emDash": true,
        "stop": options.stop || "Horizontal",
        "hanja": null,
        // "hanja": {
        //     "rendering": "HanjaInParentheses",
        //     "reading": {
        //         "initialSoundLaw": true,
        //         "useDictionaries": [
        //             "kr-stdict"
        //         ],
        //         "dictionary": {}
        //     }
        // }
    }
}

const processor = async (args, body) => {
    const {values} = args
    const options = {}
    options['stop'] = (values['vertical']) ? "Vertical" : "Horizontal"
    const response = await p({
        url: SEONBI_API_URL,
        method: 'POST',
        data: JSON.stringify(makeBody(body, options)),
    })
    const result = JSON.parse(response.body.toString())
    return result.content
}

module.exports = {
    labels,
    argsOptions,
    processor,
}
