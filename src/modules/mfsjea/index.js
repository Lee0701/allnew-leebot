
const fs = require('fs')
const path = require('path')
const mfsjea = require('./mfsjea/mfsjea')

const dict = new Set(fs.readFileSync(path.join(__dirname, 'words_alpha.txt'), 'utf8').split('\n')
        .map((line) => line.trim()).filter((line) => line))

const labels = [
    'mfsjea',
    'jeamfs',
]

const argsOptions = {
    source: {
        type: 'string',
        short: 's',
    },
    destination: {
        type: 'string',
        short: 'd',
    },
    moachigi: {
        type: 'boolean',
        short: 'm',
        default: false,
    },
    list: {
        type: 'boolean',
        short: 'l',
        default: false,
    },
}

const processCommand = async (args, body) => {
    const {values} = args
    const list = mfsjea.jeamfsList(body, values['moachigi'])
    const filtered = list.filter(({source, destination}) => source === (values['source'] || source) && destination === (values['destination'] || destination))
    const sorted = filtered.sort((a, b) => b.score - a.score)
    if(values['list']) {
        return sorted.map(({str, source, destination}) => `${str} (${source}-${destination})`).join('\n')
    } else {
        return sorted[0].str
    }
}

const processHook = async (text) => {
    const words = text.split(' ')
    const wordCount = words.filter((word) => dict.has(word)).length
    if(wordCount / words.length >= 0.5) return null
    const list = mfsjea.jeamfsList(text, false)
    const sorted = list.sort((a, b) => b.score - a.score)
    const {str, source, destination, score} = sorted[0]
    const hangulCount = str.split('').filter((c) => c >= '가' && c <= '힣').length
    if(str == text) return null
    else if(hangulCount == 0) return null
    else if(score / text.length >= 0.5) return `${str} (${source}-${destination})`
    else return null
}

const command = {
    labels,
    argsOptions,
    processor: processCommand,
}

const hook = {
    processor: processHook,
}

module.exports = {
    commands: [command],
    hooks: [hook],
}
