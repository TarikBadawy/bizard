import Karte from "../Karte"
import KartenTyp from "../KartenTyp"
import Spieler from "../Spieler"
import Stich from "../Stich"

const stich1 = new Stich()
const spieler1 = new Spieler('Shrek')
const spieler2 = new Spieler('Fiona')
const spieler3 = new Spieler('Esel')
const spieler4 = new Spieler('Lord Farquaad')
const karte1 = new Karte(KartenTyp.bizard, 1)
const karte2 = new Karte(KartenTyp.barr)
const karte3 = new Karte(KartenTyp.barr)
const karte4 = new Karte(KartenTyp.gruen, 3)

const stich2 = new Stich()
stich2.spieleKarte(spieler1, new Karte(KartenTyp.rot, 3))
stich2.spieleKarte(spieler2, new Karte(KartenTyp.rot, 4))
stich2.spieleKarte(spieler3, new Karte(KartenTyp.rot, 5))
stich2.spieleKarte(spieler4, new Karte(KartenTyp.blau, 6))

const stich3 = new Stich()
stich3.spieleKarte(spieler1, new Karte(KartenTyp.gelb, 1))
stich3.spieleKarte(spieler2, new Karte(KartenTyp.rot, 2))
stich3.spieleKarte(spieler3, new Karte(KartenTyp.rot, 3))
stich3.spieleKarte(spieler4, new Karte(KartenTyp.blau, 4))

const stich4 = new Stich()
stich4.spieleKarte(spieler1, new Karte(KartenTyp.barr))
stich4.spieleKarte(spieler2, new Karte(KartenTyp.barr))
stich4.spieleKarte(spieler3, new Karte(KartenTyp.barr))
stich4.spieleKarte(spieler4, new Karte(KartenTyp.barr))

const stich5 = new Stich()
stich5.spieleKarte(spieler1, new Karte(KartenTyp.rot, 3))
stich5.spieleKarte(spieler2, new Karte(KartenTyp.barr))
stich5.spieleKarte(spieler3, new Karte(KartenTyp.bizard))
stich5.spieleKarte(spieler4, new Karte(KartenTyp.bizard))

test('Anzahl der Karten', () => {
    expect(stich1.size).toBe(0)
    stich1.spieleKarte(spieler1, karte1)
    stich1.spieleKarte(spieler2, karte2)
    stich1.spieleKarte(spieler3, karte3)
    stich1.spieleKarte(spieler4, karte4)
    expect(stich1.size).toBe(4)
})

test('Finde die Karte eines Spielers im Stich', () => {
    expect(stich1.getKarte(spieler1)).toBe(karte1)
    expect(stich1.getKarte(spieler2)).toBe(karte2)
    expect(stich1.getKarte(spieler3)).toBe(karte3)
    expect(stich1.getKarte(spieler4)).toBe(karte4)
})

test('Finde den Spieler einer Karte im Stich', () => {
    expect(stich1.getSpieler(karte1)).toBe(spieler1)
    expect(stich1.getSpieler(karte2)).toBe(spieler2)
    expect(stich1.getSpieler(karte3)).toBe(spieler3)
    expect(stich1.getSpieler(karte4)).toBe(spieler4)
})

test('getBedienteKarte()', () => {
    expect(stich1.getAngespielteFarbe()).toBe(KartenTyp.gruen)
    expect(stich2.getAngespielteFarbe()).toBe(KartenTyp.rot)
    expect(stich3.getAngespielteFarbe()).toBe(KartenTyp.gelb)
    expect(stich4.getAngespielteFarbe()).toBe(undefined)
    expect(stich5.getAngespielteFarbe()).toBe(KartenTyp.rot)
})

test('getGewinner()', () => {
    expect(stich1.getGewinner(KartenTyp.blau)).toBe(spieler1)
    expect(stich1.getGewinner()).toBe(spieler1)
    expect(stich2.getGewinner(KartenTyp.blau)).toBe(spieler4)
    expect(stich2.getGewinner()).toBe(spieler3)
    expect(stich3.getGewinner(KartenTyp.gruen)).toBe(spieler1)
    expect(stich3.getGewinner()).toBe(spieler1)
    expect(stich4.getGewinner(KartenTyp.rot)).toBe(spieler1)
    expect(stich4.getGewinner(KartenTyp.barr)).toBe(spieler1)
    expect(stich5.getGewinner(KartenTyp.rot)).toBe(spieler3)
    expect(stich5.getGewinner(KartenTyp.barr)).toBe(spieler3)
})