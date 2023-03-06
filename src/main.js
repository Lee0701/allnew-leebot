
require('dotenv').config()
const {Telegraf} = require('telegraf')

const {parseArgs} = require('node:util')
const commands = require('./commands')

const CMD_SPLITTER = process.env['CMD_SPLITTER'] || ' '

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

const getBody = (arr) => {
    if(arr[arr.length - 1].startsWith('-')) return ""
    else return arr.pop()
}

const processCommand = (ctx) => {
    const text = ctx.message.text
    const chunks = text.split('|').map((chunk) => chunk.trim())
    let body = ''
    chunks.forEach((chunk, i) => {
        const args = chunk.split(CMD_SPLITTER)
        const chunkCmdLabel = getLabel(args.shift())
        const {argsOptions, func} = commands[chunkCmdLabel]
        const parsedArgs = parseArgs({args: args, options: argsOptions, strict: false, allowPositionals: true})
        if(!body && parsedArgs.positionals.length) body = parsedArgs.positionals.join(CMD_SPLITTER)
        const result = func(parsedArgs, body)
        body = result
    })
    ctx.reply(body)
}

Object.keys(commands).forEach((label) => bot.command(label, (ctx) => processCommand(ctx)))

bot.launch()