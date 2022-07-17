import Karte from "../Karte"
import KartenTyp from "../KartenTyp"
import Runde from "../Runde"
import Spieler from "../Spieler"

const spieler1 = new Spieler('Shrek')
const spieler2 = new Spieler('Fiona')
const spieler3 = new Spieler('Esel')
const spieler4 = new Spieler('Lord Farquaad')
const reihenfolge = [spieler1, spieler2, spieler3, spieler4]

let runde = new Runde(3, reihenfolge)

test('Konstruktor und Setzen der Trumpffarbe', () => {
    while (runde.getTrumpffarbe() != KartenTyp.bizard) {
        expect(runde.getWarteschlange().getAktiverSpieler()).toBe(spieler4)
        expect(() => runde.setzeTrumpffarbe(spieler1, KartenTyp.blau)).toThrow()
        expect(() => runde.setzeTrumpffarbe(spieler4, KartenTyp.blau)).toThrow()
        expect(() => runde.rundeAuswerten()).toThrow()
        runde = new Runde(3, reihenfolge)
    }
    expect(runde.getWarteschlange().getAktiverSpieler()).toBe(spieler3)
    expect(() => runde.setzeTrumpffarbe(spieler3, KartenTyp.bizard)).toThrow()
    expect(() => runde.macheVorhersage(spieler3, 1)).toThrow()
    spieler3.gibKarten(new Karte(KartenTyp.barr))
    expect(() => runde.spieleKarte(spieler3, new Karte(KartenTyp.barr))).toThrow()
    runde.setzeTrumpffarbe(spieler3, KartenTyp.blau)
    expect(runde.getTrumpffarbe()).toBe(KartenTyp.blau)
})

test('Vorhersagen', () => {
    expect(() => runde.spieleKarte(spieler3, new Karte(KartenTyp.barr))).toThrow()
    expect(() => runde.macheVorhersage(spieler2, 2)).toThrow()
    expect(() => runde.macheVorhersage(spieler3, -1)).toThrow()
    runde.macheVorhersage(spieler4, 2)
    runde.macheVorhersage(spieler1, 2)
    runde.macheVorhersage(spieler2, 3)
    runde.macheVorhersage(spieler3, 0)
    expect(() => runde.macheVorhersage(spieler4, 2)).toThrow()
    expect(runde.getVorhersagen().get(spieler4)).toBe(2)
    expect(runde.getVorhersagen().get(spieler1)).toBe(2)
    expect(runde.getVorhersagen().get(spieler2)).toBe(3)
    expect(runde.getVorhersagen().get(spieler3)).toBe(0)
})

test('Karten auspielen und Stiche verteilen', () => {
    reihenfolge.forEach(s => s.entferneAlleKarten())
    spieler1.gibKarten(new Karte(KartenTyp.blau, 5), new Karte(KartenTyp.rot, 10), new Karte(KartenTyp.bizard))
    spieler2.gibKarten(new Karte(KartenTyp.gruen, 5), new Karte(KartenTyp.barr), new Karte(KartenTyp.barr))
    spieler3.gibKarten(new Karte(KartenTyp.blau, 1), new Karte(KartenTyp.gruen, 1), new Karte(KartenTyp.rot, 9))
    spieler4.gibKarten(new Karte(KartenTyp.blau, 6), new Karte(KartenTyp.gruen, 3), new Karte(KartenTyp.rot, 2))

    const stich1 = runde.getAktivenStich()
    expect(runde.getTrumpffarbe()).toBe(KartenTyp.blau)
    runde.spieleKarte(spieler4, new Karte(KartenTyp.gruen, 3))
    runde.spieleKarte(spieler1, new Karte(KartenTyp.rot, 10))
    runde.spieleKarte(spieler2, new Karte(KartenTyp.barr))
    expect(() => runde.spieleKarte(spieler3, new Karte(KartenTyp.rot, 9))).toThrow()
    runde.spieleKarte(spieler3, new Karte(KartenTyp.gruen, 1))
    expect(runde.getVergebeneStiche().get(stich1)).toBe(spieler4)
    
    const stich2 = runde.getAktivenStich()
    expect(runde.getTrumpffarbe()).toBe(KartenTyp.blau)
    runde.spieleKarte(spieler4, new Karte(KartenTyp.blau, 6))
    runde.spieleKarte(spieler1, new Karte(KartenTyp.bizard))
    runde.spieleKarte(spieler2, new Karte(KartenTyp.barr))
    runde.spieleKarte(spieler3, new Karte(KartenTyp.blau, 1))
    expect(runde.getVergebeneStiche().get(stich2)).toBe(spieler1)
    
    const stich3 = runde.getAktivenStich()
    expect(runde.getTrumpffarbe()).toBe(KartenTyp.blau)
    runde.spieleKarte(spieler1, new Karte(KartenTyp.blau, 5))
    runde.spieleKarte(spieler2, new Karte(KartenTyp.gruen, 5))
    runde.spieleKarte(spieler3, new Karte(KartenTyp.rot, 9))
    runde.spieleKarte(spieler4, new Karte(KartenTyp.rot, 2))
    expect(runde.getVergebeneStiche().get(stich3)).toBe(spieler1)
    
    expect(runde.beendet()).toBe(true)
    const ergebniss = runde.rundeAuswerten()
    expect(ergebniss.get(spieler1)).toBe(40)
    expect(ergebniss.get(spieler2)).toBe(-30)
    expect(ergebniss.get(spieler3)).toBe(20)
    expect(ergebniss.get(spieler4)).toBe(-10)
})