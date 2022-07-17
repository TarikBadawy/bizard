import KartenTyp from "./KartenTyp"

export default class Karte {
    private readonly typ: KartenTyp
    private readonly wert: number

    /**
     * @param typ Der Typ stellt die Farbe oder die Spezialitaet der Karte dar.
     * @param wert Der Zahlenwert der Karte. Der Wert darf (inklusive zwischen 1 und 13 liegen).
     * Sollte nur gesetzt werden, wenn der Typ der Karte einer Farbe entspricht.
     * @throws wenn nicht 1 <= wert <= 13
     */
    constructor(typ: KartenTyp, wert: number = 1) {
        this.typ = typ
        if (1 <= wert && wert <= 13) {
            this.wert = wert
        } else {
            throw new Error('Wert muss (inklusive) zwischen 1 und 13 liegen');
        }
    }

    public getTyp(): KartenTyp {
        return this.typ
    }

    /**
     * @returns Den Wert der farbigen Karte. Wenn der Typ der Karte keine Farbe ist, ist dieser Wert beliebeig und irrelevant.
     */
    public getWert(): number {
        return this.wert
    }

    /**
     * Vergleicht den Typ und Wert einer anderen Karte
     * @param karte 
     */
    public equals(karte: Karte) {
        if(this.typ == KartenTyp.bizard || this.typ == KartenTyp.barr) {
            return karte.getTyp() == this.typ
        } else {
            return karte.getTyp() == this.typ && karte.getWert() == this.wert
        }
    }
}