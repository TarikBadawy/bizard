import Deck from "./Deck";
import Karte from "./Karte";
import KartenTyp from "./KartenTyp";
import PunkteListe from "./PunkteListe";
import Spieler from "./Spieler";
import SpielerQueue from "./SpielerQueue";
import Stich from "./Stich";

/**
 * In der einer Runde werden bekommt jeder Spieler zu Beginn genau so viele Karten, Stiche zu gewinnen sind.
 * In der vierten Stichrunde werden also jeden vier Karten ausgeteilt.
 * In der fünften Runde werden fünf Karten an jeden verteilt, usw.
 * Nachdem die Karten ausgeteilt wurden, wird vom Deck die oberste gezogen, welche die Trumpffarbe bestimmt.
 * Ist die aufgedeckte Karte ein Narr, dann gibt es in dieser Runde keine Trumpffarbe.
 * Ist die aufgedeckte Karte ein Zauberer, dann darf der Spieler, der die Karten ausgeteilt hat,
 * eine Trumpffarbe mit {@link setzeTrumpffarbe} bestimmen.
 */
export default class Runde {
    private readonly rundenNummer: number
    private readonly deck: Deck
    private readonly reihenfolge: Spieler[]
    private readonly stiche: Map<Stich, Spieler>
    private warteschlange: SpielerQueue
    private stich: Stich
    private trumpffarbe: KartenTyp
    private vorhersagen: Map<Spieler, number>

    /**
     * Erstellt eine neue Runde, teielt die Karten aus und setzt die Trumpffarbe. Zudem wird direkt ein
     * Stich erstellt. Es sollte nach Erstellung der Runde mit {@link getTrumpffarbe} überprüft werden ob
     * die Trumpffarbe ein bizard ist, um sie mit {@link setzeTrumpffarbe} zu einer Farbe zu ändern.
     * @param rundenNummer Die Nummer der Runde. Muss zwischen 1 und 14 liegen.
     * @param reihenfolge Eine Liste von Spieler, welche die Sitzreihenfolge bestimmt.
     * @throws Wenn {@link rundenNummer} nicht zwischen 1 und 14 liegt
     */
    constructor(rundenNummer: number, reihenfolge: Spieler[]) {
        if (rundenNummer < 1 || 14 < rundenNummer) {
            throw Error('Rundenanzahl ausserhalb Umfang')
        }
        this.rundenNummer = rundenNummer
        this.deck = new Deck()
        this.reihenfolge = reihenfolge
        this.stiche = new Map<Stich, Spieler>()
        this.stich = new Stich()
        this.vorhersagen = new Map<Spieler, number>()

        for (const spieler of this.reihenfolge) {
            spieler.entferneAlleKarten()
            for (let i = 0; i < this.rundenNummer; i++) {
                const karte = this.deck.zieheKarte();
                spieler.gibKarten(karte)
            }
        }

        this.trumpffarbe = this.deck.zieheKarte().getTyp()
        if (this.trumpffarbe == KartenTyp.bizard) {
            // Wenn der Trumpf ein Bizard ist, dann darf der erste Spieler den Trumpf wählen
            const spielerLinks = this.reihenfolge[(rundenNummer - 1) % reihenfolge.length]
            this.warteschlange = new SpielerQueue([spielerLinks])
        } else {
            this.warteschlange = new SpielerQueue(this.reihenfolge, rundenNummer)
        }
    }

    public getRundenNummer(): number {
        return this.rundenNummer
    }

    public getAktivenStich(): Stich {
        return this.stich
    }

    public getVergebeneStiche(): Map<Stich, Spieler> {
        return this.stiche
    }

    public getWarteschlange(): SpielerQueue {
        return this.warteschlange
    }

    public getTrumpffarbe(): KartenTyp {
        return this.trumpffarbe
    }

    public getVorhersagen(): Map<Spieler, number> {
        return this.vorhersagen
    }

    /**
     * @param spieler Der Spieler überprüft werden soll.
     * @returns Wahr wenn der angegebene Spieler gerade am Zug ist.
     */
    public istAktiverSpieler(spieler: Spieler): boolean {
        return this.getWarteschlange().getAktiverSpieler() == spieler
    }

    /**
     * @param spieler Der Spieler der die Trumpffarbe setzt.
     * @param trumpffarbe Die vom Spieler gewählt wurde.
     * @throws Wenn `istAktiverSpieler(spieler) == false`
     * @throws Wenn `getTrumpffarbe() != KartenTyp.bizard`
     * @throws Wenn `trumpffarbe.istFarbe() == false`
     */
    public setzeTrumpffarbe(spieler: Spieler, trumpffarbe: KartenTyp): void {
        if (this.istAktiverSpieler(spieler) == false) {
            throw Error('Spieler nicht am Zug')
        } else if (this.trumpffarbe != KartenTyp.bizard) {
            throw Error('Trumpf kann nur beim bizard erneut gesetzt werden')
        } else if (Karte.istFarbe(trumpffarbe) == false) {
            throw Error('Neue Trumpffarbe muss eine Farbe sein')
        } else {
            this.trumpffarbe = trumpffarbe
            this.warteschlange = new SpielerQueue(this.reihenfolge, this.rundenNummer)
        }
    }

    /**
     * Jeder Spieler muss vorhersagen, wie viele Stiche er in dieser Runde wohl machen wird.
     * Der Reihe nach geben die Spieler ihre Vorhersagen an . Es beginnt der Spieler nach dem
     * Kartengebers, so das der Kartengeber als letztes vorhersagt. Sobald die letzte Vorherasge
     * abgegeben wurde. Wird eine neue Warteschlange beginnend mit dem Spieler nach dem
     * Kartengeber erstellt.
     * @param spieler Der Spieler der vorhersagt.
     * @param vorhersage Die Vorhersage des Spielers.
     * @throws Wenn `getVorhersagen().has(spieler)`
     * @throws Wenn `istAktiverSpieler(spieler) == false`
     * @throws Wenn `vorhersage < 0`
     */
    public macheVorhersage(spieler: Spieler, vorhersage: number): void {
        if (this.trumpffarbe == KartenTyp.bizard) {
            throw Error('Zuerst muss der Trmpuf gesetzt werden')
        } else if (this.getVorhersagen().has(spieler)) {
            throw Error('Spieler kann keine 2 Vorhersagen machen')
        } else if (this.istAktiverSpieler(spieler) == false) {
            throw Error('Spieler nicht am Zug')
        } else if (vorhersage < 0) {
            throw Error('Die Vorhersage darf nicht kleiner als 0 sein')
        } else {
            this.vorhersagen.set(spieler, vorhersage)
            if (this.warteschlange.beendet()) {
                this.warteschlange = new SpielerQueue(this.reihenfolge, this.rundenNummer)
            } else {
                this.warteschlange.naechsterSpieler()
            }
        }
    }

    /**
     * Eine angespielte Farbe muss bedient werden.
     * Ist das nicht möglich, kann der Lehrling eine Farbe abwerfen oder Trumpf spielen.
     * Zauberer- und Narrenkarten dürfen immer gespielt werden, auch wenn man bedienen könnte. 
     * Auch muss man mit ihnen eine ausgespielte Farbe nicht bedienen. Sobald der letzte Spieler
     * in den Stich gespielt hat wird dieser dem Gewinner zugeordnet und eine neue Warteschlange
     * erstellt beginnend mit dem Gewinner.
     * @param spieler Der Spieler der die Karte spielt.
     * @param karte Die Karte welche vom Spieler gespielt wird.
     * @throws Wenn Trumpfwahl und Vorhersagen noch nicht abgeschlossen sind.
     * @throws Wenn `istAktiverSpieler(spieler) == false`
     * @throws Wenn spieler bedienen kann, es aber nicht tut.
     */
    public spieleKarte(spieler: Spieler, karte: Karte): boolean {
        if (this.trumpffarbe == KartenTyp.bizard) {
            throw Error('Zuerst muss der Trumpf gesetzt werden')
        } else if (this.vorhersagen.size != this.reihenfolge.length) {
            throw Error('Zuerst muessen die Vorhersagen getroffen werden')
        } else if (this.istAktiverSpieler(spieler) == false) {
            throw Error('Spieler nicht am Zug')
        } else {
            const angespielteFarbe = this.stich?.getAngespielteFarbe()
            const istTrumpf = !Karte.istFarbe(karte.getTyp()) || karte.getTyp() == this.trumpffarbe
            const bedient = karte.getTyp() == angespielteFarbe
            const mussBedienen = angespielteFarbe != undefined
            if (!istTrumpf && mussBedienen && !bedient && spieler.hatFarbe(angespielteFarbe)) {
                throw Error(`Spieler ${spieler} kann und muss ${angespielteFarbe} Bedienen`)
            } else {
                spieler.entferneKarte(karte)
                this.stich.spieleKarte(spieler, karte)
                if (this.warteschlange.beendet()) {
                    this.stichZuweisen()
                    return true
                } else {
                    this.warteschlange.naechsterSpieler()
                    return false
                }
            }
        }
    }

    /**
     * Weist dem Stich den Gewinner zu, erstellt einen neuen Stich und erstellt eine neue
     * Warteschlange beginnend mit dem Gewinner
     * @returns den Gewinner des Stiches.
     * @throws wenn `getWarteschlange().beendet() == false`
     */
    private stichZuweisen(): void {
        if (this.warteschlange.beendet() == false) {
            throw Error('Nicht alle Spieler haben in den Stich gespielt')
        } else {
            const gewinner = this.stich.getGewinner(this.trumpffarbe)
            this.stiche.set(this.stich, gewinner)
            this.stich = new Stich()
            const index = this.reihenfolge.indexOf(gewinner)
            this.warteschlange = new SpielerQueue(this.reihenfolge, index)
        }
    }

    /** @returns Wahr wenn jeder Stich in der Runde zugewiesen wurde. */
    public beendet(): boolean {
        return this.stiche.size == this.rundenNummer
    }

    /**
     * Der Lehrling, der die Anzahl seiner gewonnenen Stiche genau vorhersagen konnte, erhält
     * 20 Erfahrungspunkte plus 10 Punkte pro gewonnenen Stich. Wer daneben getippt hat, verliert
     * jeweils 10 Erfahrungspunkte für jeden Stich, den er über oder unter seiner Vorhersage liegt.
     * @returns Eine {@link PunkteListe} mit den Spielern als Schlüsselwerten und den Punkten als Einträge.
     * @throws Wenn `beendet() == false`
     */
    public rundeAuswerten(): PunkteListe {
        if (this.beendet() == false) {
            throw Error('Runde noch nicht Beendet')
        }

        const punkteListe = new PunkteListe(this.reihenfolge)
        for (const [_, spieler] of this.stiche.entries()) {
            const punkte = punkteListe.get(spieler)!
            punkteListe.set(spieler, punkte + 1)
        }

        for (const [spieler, vorhersage] of this.vorhersagen.entries()) {
            const punkte = punkteListe.get(spieler)!
            if (vorhersage == punkte) {
                punkteListe.set(spieler, 10 * vorhersage + 20)
            } else {
                punkteListe.set(spieler, -10 * Math.abs(vorhersage - punkte))
            }
        }
        return punkteListe
    }
}