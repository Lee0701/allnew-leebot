
const {convertHanjaReading} = require('./hanja-reading/hanja-reading')

const labels = [
    'hanjaReading',
]

const argsOptions = {
    format: {
        type: 'string',
        short: 'f',
        default: 'hanja(reading)'
    },
}

const parseFormat = (str) => {
    return (hanja, reading) => {
        return str.toLowerCase()
                .replace(/(hanja|h)/g, hanja)
                .replace(/(reading|r)/g, reading)
    }
}

const formatCache = {
    'hanja(reading)': (hanja, reading) => `${hanja}(${reading})`,
    'reading(hanja)': (hanja, reading) => `${reading}(${hanja})`,
    'reading': (_hanja, reading) => `${reading}`,
}

const processor = async (args, body) => {
    const {values} = args
    const formatStr = values['format']
    if(!formatCache[formatStr]) formatCache[formatStr] = parseFormat(formatStr)
    return convertHanjaReading(body, formatCache[formatStr])
}

const command = {
    labels,
    argsOptions,
    processor,
}

module.exports = {
    commands: [command],
}
