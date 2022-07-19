import BotClient from "../BotClient"
import Raum from "../Raum"
import Spieler from "../Spieler"

test('BotClient', () => {
    for (let i = 1; i <= 14; i++) {
        const raum = new Raum(i, '')
        for (let k = 0; k < 4; k++) {
            const spieler = new Spieler('BOT')
            const bot = new BotClient(spieler.getId())
            raum.registriereSpieler(spieler, bot)
            if (k == 3) {
                bot.starteSpiel()
            }
        }
        expect(raum.spiel.beendet()).toBe(true)
    }
})