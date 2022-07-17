import PunkteListe from "./PunkteListe"
import Runde from "./Runde"
import Spieler from "./Spieler"

export default class Spiel {
    private readonly spieler: Spieler[]
    private readonly rundenAnzahl: number
    private readonly runden: Map<Runde, PunkteListe>
    private punkteListe: PunkteListe
    private runde: Runde | undefined

    constructor(rundenAnzahl: number) {
        this.spieler = []
        this.rundenAnzahl = rundenAnzahl
        this.punkteListe = new PunkteListe([])
        this.runden = new Map<Runde, PunkteListe>
    }

    public getRundenAnzahl(): number {
        return this.rundenAnzahl
    }

    public getReihenfolge(): Spieler[] {
        return Array.from(this.spieler.values())
    }

    public getPunkteListe(): PunkteListe{
        return this.punkteListe
    }

    public getRunden(): Map<Runde, PunkteListe> {
        return this.runden
    }

    /**
     * @returns die aktuelle Runde
     * @throws Wenn gestartet() == false
     */
    public getRunde(): Runde {
        if (this.gestartet() == false) {
            throw Error('Spiel hat noch nicht begonnen')
        } else {
            return this.runde!
        }
    }

    public getSpielerNamen(): string[] {
        return this.getReihenfolge().map(s => s.getName())
    }

    public fuegeSpielerHinzu(spieler: Spieler) {
        this.spieler.push(spieler)
    }

    /**
     * Startet das Spiel, erstellt die erste Runde, und benschrichtig jeden Spieler
     * @throws gestartet()
     * @throws Wenn Spielerzahl nicht zwischen 3 und 6 liegt
     */
    public starteSpiel(): void {
        if (this.gestartet()) {
            throw Error('Spiel bereits gestartet')
        } else if (3 <= this.spieler.length && this.spieler.length <= 6) {
            this.punkteListe = new PunkteListe(this.getReihenfolge())
            this.runde = new Runde(1, this.getReihenfolge())
        } else {
            throw Error('Spielerzahl muss zwischen 3 und 6 liegen')
        }
    }

    public gestartet(): boolean {
        return this.runde != undefined
    }

    public beendet(): boolean {
        const runde = this.runde
        if (runde != undefined) {
            return runde.beendet() && runde.getRundenNummer() == this.rundenAnzahl
        }
        return false
    }

    /**
     * Erstellt eine neue Runde. Abgesehen fuer die erste Runde, muss sichergestellt werden, dass
     * die vorherige Runde abgeschlossen ist
     * @throws Wenn getRunde().beendet() == false
     * @throws Wenn beendet() == true
     */
    public naechsteRunde(): void {
        if (this.runde == undefined) {
            throw Error('Spiel hat noch nicht begonnen')
        } else if (this.getRunde().beendet() == false) {
            throw Error('Runde noch nicht beendet')
        } else if (this.beendet()) {
            throw Error('Das Spiel ist beendet')
        } else {
            const nummer = this.runde.getRundenNummer() + 1
            this.runde = new Runde(nummer, this.getReihenfolge())
        }
    }

    public werteRundeAus(): void {
        const runde = this.getRunde()
        if (runde.beendet()) {
            const ergebnis = runde.rundeAuswerten()
            this.runden.set(runde, ergebnis)
            this.punkteListe.addiere(ergebnis)
        } else {
            throw Error('')
        }
    }
}