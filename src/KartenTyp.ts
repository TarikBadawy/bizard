enum KartenTyp {
    rot = 'rot',
    gruen = 'gruen',
    blau = 'blau',
    gelb = 'gelb',
    bizard = 'bizard',
    barr = 'barr',
}

namespace KartenTyp {
    export function istFarbe(typ: KartenTyp): boolean {
        return typ == KartenTyp.rot
        || typ == KartenTyp.gruen
        || typ == KartenTyp.blau
        || typ == KartenTyp.gelb
    }
    
    export function parse(str: string): KartenTyp {
        const typ = {
            'rot': KartenTyp.rot,
            'gruen': KartenTyp.gruen,
            'blau': KartenTyp.blau,
            'gelb': KartenTyp.gelb,
            'bizard': KartenTyp.bizard,
            'barr': KartenTyp.barr,
        }[str]
        if (typ == undefined) {
            throw Error('Kein Kartentyp')
        }
        return typ
    }
}

export default KartenTyp