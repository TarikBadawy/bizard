import Spieler from "./Spieler";

/**
 * Modelliert die Sitzreihenfolge und zusaetzlich das durchgehen der Reihenfolge z.B. fuer einen Stich.
 * Dabei nimmt die SpielerQueue eine feste nicht veraenderbare Sitzreihenfolge entgegen. Anhand dieser
 * Reihenfolge kann eine Warteschlange erstellt werden, welche bei einem uebergebenen Spieler anfaengt.
 * Diese Warteschlange, wird dann der Reihenfolge nach abgearbeitet.
 */
export default class SpielerQueue {
    private warteschlange: Spieler[]
    private aktiverSpieler: Spieler

    /**
     * @param reihenfolge Die Sitzreihenfolge der Spieler.
     * @throws wenn reihenfolge.length == 0
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

    /**
     * @returns den vordersten Spieler in der Warteschlange
     */
    public getAktiverSpieler(): Spieler {
        return this.aktiverSpieler
    }

    /**
     * @returns Die restlichen Spieler in der Warteschlange
     */
    public getRestlichenSpieler(): Spieler[] {
        return this.warteschlange
    }

    /**
     * Entfernt den Vordersten Spieler aus der Warteschlange
     * @returns den entfernten Spieler
     * @throws beendet() == true
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

    /**
     * @returns Wahr wenn keine Spieler mehr in der Warteschlange sind.
     */
    public beendet(): boolean {
        return this.warteschlange.length == 0
    }
}