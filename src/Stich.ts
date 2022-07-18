import Karte from "./Karte"
import KartenTyp from "./KartenTyp"
import Spieler from "./Spieler"

/**
 * Ein stich, welcher von den Spielern gewonnen werden kann.
 * Jeder Spieler spielt genau eine Karte in den Stich.
 */
export default class Stich extends Map<Spieler, Karte> {
    /** Erstellt einen leeren Stich. */
    public constructor() {
        super()
    }

    /**
     * Legt eine Karte auf den Stich und wird einem Spieler zugeordet.
     * @param spieler Spieler der die Karte gespielt hat.
     * @param karte Karte die vom Spieler gespielt wurde.
     * @throws Wenn `has(spieler)`
     */
    public spieleKarte(spieler: Spieler, karte: Karte): void {
        if (this.has(spieler)) {
            throw Error('Spieler darf nur eine Karte spielen')
        } else {
            this.set(spieler, karte)
        }
    }

    /**
     * @param spieler Der Spieler dessen Karte gesucht werden soll.
     * @returns Die Karte, welche vom Spieler gelegt wurde.
     * @throws Wenn `has(spieler) == false`
     */
    public getKarte(spieler: Spieler): Karte {
        const karte = this.get(spieler)
        if (karte != undefined) {
            return karte
        } else {
            throw Error('Spieler hat keine Karte im Stich')
        }
    }

    /**
     * @param karte Die Karte nach der gesucht werden soll.
     * @returns Der Spieler, der die Karte gespielt hat.
     * @throws Wenn Karte von keinem Spieler gespielt wurde.
     */
    public getSpieler(karte: Karte): Spieler {
        for (const [spieler, k] of this.entries()) {
            if (karte === k) {
                return spieler
            }
        }
        throw Error('Karte wurde von keinem Spieler gespielt')
    }

    /**
     * Die Farbe, die zu erst ein einem Stich gespielt wird ist die angespielte Farbe.
     * @returns Die Farbe, welche bedient werden muss. `undefined`, wenn noch keine Karte mit
     * einer Farbe auf dem Stapel liegt.
     */
    public getAngespielteFarbe(): KartenTyp | undefined {
        for (const karte of this.values()) {
            const typ = karte.getTyp()
            if (Karte.istFarbe(typ)) {
                return typ
            }
        }
    }

    /**
     * Der Stich wird von dem Spieler gewonnen der:
     * 1. Als erstes einen Bizard gespielt hat
     * 2. Den Höchsten Trumpf gespielt hat
     * 3. Die Hoechste zu bedienende Karte gespielt hat
     * 4. Den Ersten Barr gespielt hat
     * @param trumpffarbe Der Trumpf des Stiches. Optional, da eine Runde keinen Trumpf haben muss.
     * Der Bizard ist keine Trumpffarbe. Wenn der Trumpf ein Bard ist, dann wird die Trumpffarbe
     * ignoriert.
     * @returns Der Gewinner eines Stiches.
     * @throws wenn `trumpffarbe == KartenTyp.bizard`
     * @throws wenn `size == 0`
     */
    public getGewinner(trumpffarbe?: KartenTyp): Spieler {
        if (trumpffarbe == KartenTyp.bizard) {
            throw Error('Trumpf darf kein bizard sein')
        } else if (trumpffarbe == KartenTyp.barr) {
            trumpffarbe = undefined
        }
        let gewinner
        for (const [spieler, karte] of this.entries()) {
            if (gewinner == undefined) {
                gewinner = spieler
            } else {
                const hoechsteKarte = this.getKarte(gewinner)
                const hoechsteKarteIstBizard = hoechsteKarte.getTyp() == KartenTyp.bizard
                const hoechsteKarteIstTrumpf = hoechsteKarte.getTyp() == trumpffarbe
                const hoechsteKarteBedient = hoechsteKarte.getTyp() == this.getAngespielteFarbe()
                const karteIstBizard = karte.getTyp() == KartenTyp.bizard
                const karteIstTrumpf = karte.getTyp() == trumpffarbe
                const karteBedient = karte.getTyp() == this.getAngespielteFarbe()
                const karteHatHoerenWert = karte.getWert() >= hoechsteKarte.getWert()

                if (!hoechsteKarteIstBizard) {
                    if (karteIstBizard) {
                        gewinner = spieler
                    } else if (karteIstTrumpf && (!hoechsteKarteIstTrumpf || karteHatHoerenWert)) {
                        gewinner = spieler
                    } else if (karteBedient && (!hoechsteKarteBedient || karteHatHoerenWert)) {
                        gewinner = spieler
                    }
                }
            }
        }
        if (gewinner == undefined) {
            throw Error('Stich ist leer')
        } else {
            return gewinner
        }
    }
}