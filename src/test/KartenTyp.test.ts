import KartenTyp from "../KartenTyp";

test('string Form', () => {
    expect(KartenTyp.rot).toBe('rot')
    expect(KartenTyp.gruen).toBe('gruen')
    expect(KartenTyp.blau).toBe('blau')
    expect(KartenTyp.gelb).toBe('gelb')
    expect(KartenTyp.bizard).toBe('bizard')
    expect(KartenTyp.barr).toBe('barr')
})