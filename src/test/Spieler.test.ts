import Karte from "../Karte"
import KartenTyp from "../KartenTyp"
import Spieler from "../Spieler"

let spieler = new Spieler('Max Mustermann')

test('Spielername', () => {
    expect(spieler.getName()).toBe('Max Mustermann')
})

test('Dem Spieler Karten geben', () => {
    expect(spieler.getHand()). toStrictEqual([])
    const karte = new Karte(KartenTyp.barr)
    spieler.gibKarten(karte)
    expect(spieler.getHand()[0].equals(karte)).toBe(true)
    expect(spieler.hatKarte(karte)).toBe(true)
    expect(spieler.hatKarte(new Karte(KartenTyp.barr))).toBe(true)
    expect(spieler.hatKarte(new Karte(KartenTyp.bizard))).toBe(false)
})

test('Karte vom Spieler entfernen', () => {
    expect(spieler.getHand().length).toBe(1)
    const karte = new Karte(KartenTyp.gruen, 3)
    spieler.gibKarten(karte, karte, karte, karte)
    expect(spieler.getHand().length).toBe(5)
    spieler.entferneKarte(karte)
    expect(spieler.getHand().length).toBe(4)
    expect(() => spieler.entferneKarte(new Karte(KartenTyp.rot, 1))).toThrow()
    spieler.entferneAlleKarten()
    expect(spieler.getHand()[0]).toBe(undefined)
    expect(spieler.getHand().length).toBe(0)
})