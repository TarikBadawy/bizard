import Spieler from "./Spieler";

/**
 * Modelliert die Sitzreihenfolge und zusätzlich das Durchgehen der Reihenfolge z.B. für einen Stich.
 * Dabei nimmt die SpielerQueue eine feste nicht veraenderbare Sitzreihenfolge entgegen. Anhand dieser
 * Reihenfolge kann eine Warteschlange erstellt werden, welche bei einem übergebenen Spieler anfängt.
 */
export default class SpielerQueue {
    private warteschlange: Spieler[]
    private aktiverSpieler: Spieler

    /**
     * @param reihenfolge Die Sitzreihenfolge der Spieler.
     * @param rotation Der offset (versetz) des ersten Spielers
     * @throws Wenn `reihenfolge.length == 0`
     * @example
     * const sq = new SpielerQueue([s0, s1, s2, s3], 2)
     * sq.getAktiverSpieler() // s2
     * sq.getRestlichenSpieler() // [s3, s0, s1]
     */
    constructor(reihenfolge: Spieler[], rotation: number = 0) {
        if (reihenfolge.length == 0) {
            throw Error('Liste darf nicht leer sein')
        }
        this.warteschlange = [...reihenfolge]
        for (let i = 0; i < rotation % this.warteschlange.length; i++) {
            this.warteschlange.push(this.warteschlange.shift() as Spieler)
        }
        this.aktiverSpieler = this.naechsterSpieler()
    }

    /** @returns Der vorderste Spieler in der Warteschlange. */
    public getAktiverSpieler(): Spieler {
        return this.aktiverSpieler
    }

    /** @returns Die restlichen Spieler in der Warteschlange. */
    public getRestlichenSpieler(): Spieler[] {
        return this.warteschlange
    }

    /**
     * Entfernt den Vordersten Spieler aus der Warteschlange.
     * @returns Der entfernte Spieler.
     * @throws `beendet() == true`
     */
    public naechsterSpieler(): Spieler {
        const spieler = this.warteschlange.shift()
        if (spieler != undefined) {
            this.aktiverSpieler = spieler
            return spieler
        } else {
            throw Error('Kein Spieler in Warteschlange')
        }
    }

    /** @returns Wahr wenn keine Spieler mehr in der Warteschlange sind. */
    public beendet(): boolean {
        return this.warteschlange.length == 0
    }
}