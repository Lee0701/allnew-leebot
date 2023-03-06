
const commands = [
    require('./caseConvert'),
    require('./mfsjeaConvert'),
    require('./seonbi'),
    require('./hanjaReading'),
]

module.exports = Object.fromEntries(commands.flatMap(({labels, argsOptions, processor}) => {
    return labels.map((label) => [label.toLowerCase(), {argsOptions, processor}])
}))
