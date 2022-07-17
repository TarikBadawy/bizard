import Karte from "../Karte"
import KartenTyp from "../KartenTyp"

const karte1 = new Karte(KartenTyp.bizard, 1)
const karte2 = new Karte(KartenTyp.barr, 1)
const karte3 = new Karte(KartenTyp.rot, 5)
const karte4 = new Karte(KartenTyp.gruen, 3)
const karte5 = new Karte(KartenTyp.blau, 8)
const karte6 = new Karte(KartenTyp.gelb, 1)

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