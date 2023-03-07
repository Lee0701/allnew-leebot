
const mfsjea = require('./mfsjea/mfsjea')

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

const processor = async (args, body) => {
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

const command = {
    labels,
    argsOptions,
    processor,
}

module.exports = {
    commands: [command],
}
