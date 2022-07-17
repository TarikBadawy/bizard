import Karte from "./Karte"
import KartenTyp from "./KartenTyp"
import { randomUUID as uuid } from 'crypto'

export default class Spieler {
    private readonly id: string
    private readonly name: string
    private readonly hand: Karte[]

    /**
     * Erstellt einen neuen Spieler mit einer leeren Hand, dem uebergebenen Namen und einer
     * einzigartigen ID
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

    /**
     * @param karten die dem Spieler in die Hand gelegt werden
     */
    public gibKarten(...karten: Karte[]): void {
        this.hand.push(...karten)
    }

    /**
     * @param karte nach der gesucht werden soll
     * @returns Wahr wenn der Spieler die Gleiche Karte auf der Hand hat
     */
    public hatKarte(karte: Karte): boolean {
        return this.hand.find(k => karte.equals(k)) != undefined
    }

    /**
     * 
     * @param farbe nach der in der Hand gesucht werden soll
     * @returns Wahr, wenn der Spieler mindestens eine Karte mit der gegebenen
     * Farbe in der Hand hat
     */
    public hatFarbe(farbe: KartenTyp): boolean {
        return this.hand.find(k => k.getTyp() == farbe) != undefined
    }

    /**
     * Entfernt genau eine Karte, welche mit der angebenen übereinstimmt
     * @param karte die entfern werden soll
     * @throws wenn hatKarte(karte) == false
     */
    public entferneKarte(karte: Karte): void {
        if (this.hatKarte(karte) == false) {
            throw new Error('Karte nicht in Hand');
        } else {
            const index = this.hand.findIndex(k => karte.equals(k))
            this.hand.splice(index, 1)
        }
    }

    /**
     * Entfernt alle Karten aus der Hand
     */
    public entferneAlleKarten(): void {
        this.hand.length = 0
    }
}