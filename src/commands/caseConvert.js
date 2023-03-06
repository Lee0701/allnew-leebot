
const labels = [
    'caseConvert',
    'case',
]

const argsOptions = {
    upper: {
        type: 'boolean',
        short: 'u',
    },
    lower: {
        type: 'boolean',
        short: 'l',
    },
    auto: {
        type: 'boolean',
        short: 'a',
    },
    random: {
        type: 'boolean',
        short: 'r',
    },
}

const processor = async (args, body) => {
    const {values} = args
    if(values['upper'] === true) {
        return body.toUpperCase()
    } else if(values['lower'] === true) {
        return body.toLowerCase()
    } else if(values['auto'] === true) {
        const sentences = body.split('.')
        return sentences.map((sent) => {
            const words = sent.split(' ')
            const firstWordIndex = words.findIndex((w) => w != '')
            if(firstWordIndex < 0) return sent
            const trimmed = words[firstWordIndex].trim()
            const trimIndex = words[firstWordIndex].indexOf(trimmed)
            const firstWord = words[firstWordIndex].slice(0, trimIndex) + words[firstWordIndex].slice(trimIndex, trimIndex+1).toUpperCase() + words[firstWordIndex].slice(trimIndex+1)
            return [...words.slice(0, firstWordIndex), firstWord, ...words.slice(firstWordIndex+1)].join(' ')
        }).join('.')
    } else if(values['random'] === true) {
        return body.split('').map((c) => (Math.random() >= 0.5 ? c.toUpperCase() : c.toLowerCase())).join('')
    } else {
        return body
    }
}

module.exports = {
    labels,
    argsOptions,
    processor,
}
