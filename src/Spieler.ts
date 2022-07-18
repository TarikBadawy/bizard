import Karte from "./Karte"
import KartenTyp from "./KartenTyp"
import { randomUUID as uuid } from 'crypto'

/**
 * Ein spieler, mit einer ID, einem Name und eienr Hand von Karten. Wir können dem Spieler
 * Karten geben, Karten nehmen und die Hand abfragen.
 */
export default class Spieler {
    private readonly id: string
    private readonly name: string
    private readonly hand: Karte[]

    /**
     * Erstellt einen neuen Spieler mit einer leeren Hand, dem uebergebenen Namen und einer
     * einzigartigen ID.
     * @param name des Spielers
     */
    constructor(name: string) {
        this.id = uuid()
        this.name = name
        this.hand = []
    }

    public getId(): string {
        return this.id
    }

    public getName(): string {
        return this.name
    }

    public getHand(): Karte[] {
        return this.hand
    }

    /** @param karten Die Liste an Karten, welche dem Spieler in de Hand gelegt wird. */
    public gibKarten(...karten: Karte[]): void {
        this.hand.push(...karten)
    }

    /**
     * @param karte Die Karte ach der die Hand überprüft werden soll.
     * @returns Wahr wenn der Spieler die Gleiche Karte auf der Hand hat.
     */
    public hatKarte(karte: Karte): boolean {
        return this.hand.find(k => karte.equals(k)) != undefined
    }

    /**
     * @param farbe Die Farbe nach der in der Hand gesucht werden soll.
     * @returns Wahr, wenn der Spieler mindestens eine Karte mit der gegebenen Farbe in der
     * Hand hat.
     */
    public hatFarbe(farbe: KartenTyp): boolean {
        return this.hand.find(k => k.getTyp() == farbe) != undefined
    }

    /**
     * Entfernt genau eine Karte, welche mit der angebenen übereinstimmt.
     * @param karte Die Karte, die entfernt werden soll.
     * @throws Wenn `hatKarte(karte) == false`
     */
    public entferneKarte(karte: Karte): void {
        if (this.hatKarte(karte) == false) {
            throw new Error('Karte nicht in Hand');
        } else {
            const index = this.hand.findIndex(k => karte.equals(k))
            this.hand.splice(index, 1)
        }
    }

    /** Entfernt alle Karten aus der Hand. */
    public entferneAlleKarten(): void {
        this.hand.length = 0
    }
}