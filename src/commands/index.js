
const commands = [
    require('./caseConvert'),
    require('./mfsjeaConvert'),
    require('./seonbi'),
]

module.exports = Object.fromEntries(commands.flatMap(({labels, argsOptions, processor}) => {
    return labels.map((label) => [label, {argsOptions, processor}])
}))
