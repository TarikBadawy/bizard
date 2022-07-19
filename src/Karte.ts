import KartenTyp from "./KartenTyp"

export default class Karte {
    private readonly typ: KartenTyp
    private readonly wert: number

    /**
     * @param typ Der KartenTyp der Karte
     * @param wert Der Zahlenwert der Karte. Der Wert darf (inklusive zwischen 1 und 13 liegen).
     * Der Wert ist nur für Karten mit einer Farbe als Typ relevant. Die Spezialkarten tragen
     * keinen Wert
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

    public getWert(): number {
        return this.wert
    }

    /**
     * @param karte mit der diese Karte verglichen werden soll.
     * @return Wahr, wenn diese und die eingebenene Karte gliechen Typ und Wert haben
     */
    public equals(karte: Karte): boolean {
        if(this.typ == KartenTyp.bizard || this.typ == KartenTyp.barr) {
            return karte.getTyp() == this.typ
        } else {
            return karte.getTyp() == this.typ && karte.getWert() == this.wert
        }
    }

    /**
     * @param typ Der zu überprüfende Typ
     * @returns Wahr, wenn der Typ eine Farbe ist
     */
    public static istFarbe(typ: KartenTyp): boolean {
        return typ == KartenTyp.rot
        || typ == KartenTyp.gruen
        || typ == KartenTyp.blau
        || typ == KartenTyp.gelb
    }
}