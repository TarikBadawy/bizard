import KartenTyp from "../KartenTyp";

test('istFarbe()', () => {
    expect(KartenTyp.istFarbe(KartenTyp.rot)).toBe(true)
    expect(KartenTyp.istFarbe(KartenTyp.gruen)).toBe(true)
    expect(KartenTyp.istFarbe(KartenTyp.blau)).toBe(true)
    expect(KartenTyp.istFarbe(KartenTyp.gelb)).toBe(true)
    expect(KartenTyp.istFarbe(KartenTyp.bizard)).toBe(false)
    expect(KartenTyp.istFarbe(KartenTyp.barr)).toBe(false)
})

test('string Form', () => {
    expect(KartenTyp.rot).toBe('rot')
    expect(KartenTyp.gruen).toBe('gruen')
    expect(KartenTyp.blau).toBe('blau')
    expect(KartenTyp.gelb).toBe('gelb')
    expect(KartenTyp.bizard).toBe('bizard')
    expect(KartenTyp.barr).toBe('barr')
})