
const {convertHanjaReading} = require('./hanja-reading/hanja-reading')

const labels = [
    'hanjaReading',
]

const argsOptions = {
}

const processor = async (args, body) => {
    const {values} = args
    return convertHanjaReading(body)
}

module.exports = {
    labels,
    argsOptions,
    processor,
}
