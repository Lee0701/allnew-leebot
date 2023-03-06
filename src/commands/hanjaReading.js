
const {convertHanjaReading} = require('./hanja-reading/hanja-reading')

const labels = [
    'hanja-reading',
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
