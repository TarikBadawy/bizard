import BotNamen from "./BotNamen"
import BotClient from "./BotClient"
import express from 'express'
import http from "http"
import Spieler from "./Spieler"
import { resolve } from "path"
import { sample } from "lodash"
import { Server } from "socket.io"
import { randomUUID as uuid } from 'crypto'
import Raum from "./Raum"
import Client from "./Client"

const app = express()
const server = http.createServer(app)
export const io = new Server(server)

const raeume = new Map<string, Raum>()

if (process.env.NODE_ENV != 'test') {
    main()
}

async function main() {
    app.use(express.static(resolve(__dirname, '../public')))
    io.on('connection', socket => {
        socket.on('erstelle', (name, runden) => {
            if (typeof name == "string" && typeof runden == "number") {
                const raum = new Raum(runden, 'Raum von ' + name)
                const spieler = new Spieler(name)
                const client = new Client(socket)
                raeume.set(uuid(), raum)
                socket.emit('id', spieler.getId())
                client.onBotHinzufuegen(() => botHinzufuegen(raum))
                raum.registriereSpieler(spieler, client)
                io.emit('raeume', Array.from(raeume.entries()).map(([id, raum]) => [id, raum.name]))
            }
        })
        socket.on('beitreten', (name, id) => {
            if (typeof name == "string" && typeof id == "string") {
                const raum = raeume.get(id)!
                const spieler = new Spieler(name)
                const client = new Client(socket)
                socket.emit('id', spieler.getId())
                client.onBotHinzufuegen(() => botHinzufuegen(raum))
                raum.registriereSpieler(spieler, client)
            }
        })
    })
    server.listen(80)
}

export function botHinzufuegen(raum: Raum) {
    const name = sample(BotNamen) || 'COM'
    const spieler = new Spieler(name)
    const bot = new BotClient(spieler.getId())
    raum.registriereSpieler(spieler, bot)
}