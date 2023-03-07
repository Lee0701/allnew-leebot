
const modules = [
    require('./caseConvert'),
    require('./mfsjea'),
    require('./seonbi'),
    require('./hanjaReading'),
]

const commands = Object.fromEntries(modules.flatMap((module) => {
    return (module.commands || []).flatMap(({labels, argsOptions, processor}) => {
        return labels.map((label) => [label.toLowerCase(), {argsOptions, processor}])
    })
}))

module.exports = {
    modules,
    commands,
}
