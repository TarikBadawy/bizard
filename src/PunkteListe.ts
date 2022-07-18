import Spieler from "./Spieler";

/**
 * Eine Liste von Spieler - Punkte Paaren. Punktelisten können mit anderen
 * Punktelisten addiert werden.
 */
export default class PunkteListe extends Map<Spieler, number> {
    constructor(spielerListe: Spieler[]) {
        super()
        for (const spieler of spielerListe) {
            this.set(spieler, 0)
        }
    }

    /**
     * Addition von zwei Punktelisten. Diese Punkteliste wird mit dem Ergebnis
     * der Addition überschrieben.
     * @param liste Die Liste mit diese addiert werden soll.
     * @throws Wenn die Listen unterschiedliche Länge haben
     * @throws Wenn die Menge der Spieler der Eingabeliste nicht alle Spieler dieser Liste abdeckt.
     */
    public addiere(liste: PunkteListe): void {
        if (liste.size != this.size) {
            throw Error('Liste haben verschiedene längen')
        }
        for (const [spieler, punkte] of this) {
            if (liste.has(spieler)) {
                this.set(spieler, punkte + liste.get(spieler)!)
            } else {
                throw Error('Spieler nicht gleich in beiden Listen')
            }
        }
    }
}