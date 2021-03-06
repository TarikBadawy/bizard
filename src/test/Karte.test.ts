import Karte from "../Karte"
import KartenTyp from "../KartenTyp"

const karte1 = new Karte(KartenTyp.bizard, 1)
const karte3 = new Karte(KartenTyp.rot, 5)

test('Der Kartenwert liegt im richtigen Bereich', () => {
    expect(() => new Karte(KartenTyp.rot, 0)).toThrow()
    expect(new Karte(KartenTyp.rot, 1)).toBeInstanceOf(Karte)
    expect(new Karte(KartenTyp.rot, 13)).toBeInstanceOf(Karte)
    expect(() => new Karte(KartenTyp.rot, 14)).toThrow()
})

test('Die equals Methode von Karte', () => {
    expect(karte1.equals(new Karte(KartenTyp.bizard, 5))).toBe(true)
    expect(karte1.equals(new Karte(KartenTyp.bizard))).toBe(true)
    expect(karte1.equals(new Karte(KartenTyp.barr))).toBe(false)
    expect(karte3.equals(new Karte(KartenTyp.rot, 5))).toBe(true)
    expect(karte3.equals(new Karte(KartenTyp.rot, 4))).toBe(false)
    expect(karte3.equals(new Karte(KartenTyp.blau, 5))).toBe(false)
    expect(karte3.equals(new Karte(KartenTyp.bizard))).toBe(false)
})

test('istFarbe()', () => {
    expect(Karte.istFarbe(KartenTyp.rot)).toBe(true)
    expect(Karte.istFarbe(KartenTyp.gruen)).toBe(true)
    expect(Karte.istFarbe(KartenTyp.blau)).toBe(true)
    expect(Karte.istFarbe(KartenTyp.gelb)).toBe(true)
    expect(Karte.istFarbe(KartenTyp.bizard)).toBe(false)
    expect(Karte.istFarbe(KartenTyp.barr)).toBe(false)
})