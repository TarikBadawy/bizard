import Spieler from "./Spieler";

export default class PunkteListe extends Map<Spieler, number> {
    constructor(spielerListe: Spieler[]) {
        super()
        for (const spieler of spielerListe) {
            this.set(spieler, 0)
        }
    }

    public addiere(liste: PunkteListe) {
        if (liste.size != this.size) {
            return Error('Liste haben verschiedene längen')
        }
        for (const [spieler, punkte] of liste) {
            if (this.has(spieler)) {
                this.set(spieler, punkte + this.get(spieler)!)
            } else {
                throw Error('Spieler nicht gleich in beiden Listen')
            }
        }
    }
}