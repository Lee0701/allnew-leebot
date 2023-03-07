
require('dotenv').config()
const {parseArgs} = require('node:util')
const split = require('split-string')

const {Telegraf} = require('telegraf')
const {message} = require('telegraf/filters')

const {modules, commands, hooks} = require('./modules')

const CMDS_SPLITTER = process.env['CMD_SPLITTER'] || '|'
const ARGS_SPLITTER = process.env['ARGS_SPLITTER'] || ' '
const keep = (value, state) => {
    return value !== '\\' && (value !== '"' || value !== "'" || state.prev() === '\\')
}
const splitOptions = {
    quotes: ['"', "'"],
    keep,
}

const bot = new Telegraf(process.env.TG_BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply('START')
})

bot.help((ctx) => {
    ctx.reply('HELP')
})

const getLabel = (str) => {
    if(!str.startsWith('/')) return false
    else return str.split('@')[0].slice(1)
}

const processCommand = async (ctx) => {
    const text = ctx.message.text
    const chunks = split(text, {separator: CMDS_SPLITTER, ...splitOptions}).map((chunk) => chunk.trim())
    let body = ''
    for(let chunk of chunks) {
        const args = split(chunk, {separator: ARGS_SPLITTER, ...splitOptions})
        const chunkCmdLabel = getLabel(args.shift().toLowerCase())
        if(!commands[chunkCmdLabel]) {
            body = `Command not found: ${chunkCmdLabel}`
            break
        }
        const {argsOptions, processor} = commands[chunkCmdLabel]
        const parsedArgs = parseArgs({args: args, options: argsOptions, strict: false, allowPositionals: true})
        if(!body && parsedArgs.positionals.length) {
            body = parsedArgs.positionals.join(ARGS_SPLITTER)
            if(body == '^' && ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
                body = ctx.message.reply_to_message.text
            }
        }
        const result = await processor(parsedArgs, body)
        body = result
    }
    try {
        await ctx.reply(body, {parse_mode: 'HTML', reply_to_message_id: ctx.message.message_id})
    } catch(e) {
        console.error(e)
    }
}

Object.keys(commands).forEach((label) => bot.command(label.toLowerCase(), async (ctx) => await processCommand(ctx)))

bot.on(message('text'), async (ctx) => {
    const results = await Promise.all(hooks.map(({processor}) => processor(ctx.message.text)))
    const filtered = results.filter((result) => result)
    await Promise.all(filtered.map((result) => ctx.reply(result, {parse_mode: 'HTML', reply_to_message_id: ctx.message.message_id})))
})

bot.launch()