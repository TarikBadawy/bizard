import KartenTyp from "../KartenTyp"
import Runde from "../Runde"
import Spieler from "../Spieler"
import { spielerNachricht, rundeNachricht } from "../Nachricht"

const spieler1 = new Spieler('Shrek')
const spieler2 = new Spieler('Fiona')
const spieler3 = new Spieler('Shrek')
const spielerNachricht1 = spielerNachricht(spieler1)
const spielerNachricht2 = spielerNachricht(spieler2)
const spielerNachricht3 = spielerNachricht(spieler3)

test('SpielerNachricht', () => {
    expect(spielerNachricht1.name).toBe('Shrek')
    expect(spielerNachricht2.name).toBe('Fiona')
    expect(spielerNachricht3.name).toBe('Shrek')
})

const reihenfolge = [spieler1, spieler2, spieler3]

test('RundeNachricht', () => {
    const runde = new Runde(1, reihenfolge)
    let nachricht = rundeNachricht(runde)
    expect(nachricht.rundenNummer).toBe(1)
    expect(nachricht.stich.length).toBe(0)
    expect(nachricht.stiche.length).toBe(0)
    expect(nachricht.vorhersagen.length).toBe(0)
    if (nachricht.trumpffarbe == KartenTyp.bizard.toString()) {
        expect(nachricht.aktiverSpieler.id).toBe(spielerNachricht1.id)
        expect(nachricht.warteschlange).toStrictEqual([]) //throws
    } else {
        expect(nachricht.aktiverSpieler.id).toBe(spielerNachricht2.id)
        expect(nachricht.warteschlange).toStrictEqual([spielerNachricht3, spielerNachricht1])
    }
})

test('SpielNachricht', () => {
    // TODO implement
})

test('KartenNachricht', () => {
    // TODO implement
})

test('StichNachricht', () => {
    // TODO implement
})