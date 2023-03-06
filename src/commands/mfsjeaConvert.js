
const mfsjea = require('./mfsjea/mfsjea')

const labels = [
    'mfsjea-convert',
    'mfsjea',
    'jeamfs-convert',
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

const func = (args, body) => {
    const {values} = args
    const list = mfsjea.jeamfsList(body, values['moachigi'])
    const filtered = list.filter(({source, destination}) => source === (values['source'] || source) && destination === (values['destination'] || destination))
    const sorted = filtered.sort((a, b) => b.score - a.score)
    console.log(sorted)
    if(values['list']) {
        return sorted.map(({str, source, destination}) => `${str} (${source}-${destination})`).join('\n')
    } else {
        return sorted[0].str
    }
}

module.exports = {
    labels,
    argsOptions,
    func,
}
