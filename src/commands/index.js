
const commands = [
    require('./caseConvert'),
    require('./mfsjeaConvert'),
]

module.exports = Object.fromEntries(commands.flatMap(({labels, argsOptions, func}) => {
    return labels.map((label) => [label, {argsOptions, func}])
}))
