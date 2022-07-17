import { shuffle } from 'lodash'
import Karte from "./Karte"
import KartenTyp from './KartenTyp'

/**
 * Einse Sammlung an 60 Karten: 4x Bizard, 4x Barr und 13 von jeder der vier Farben.
 */
export default class Deck {
    private readonly karten: Karte[]

    /**
     * Erstellt ein Deck mit 60 Karten. Die Reihenfolge der Karten ist Zufaellig.
     */
    constructor() {
        this.karten = []
        for (let i = 0; i < 4; i++) {
            this.karten.push(new Karte(KartenTyp.bizard))
            this.karten.push(new Karte(KartenTyp.barr))
        }
        for (let j = 0; j < 13; j++) {
            this.karten.push(new Karte(KartenTyp.rot, j + 1))
            this.karten.push(new Karte(KartenTyp.gruen, j + 1))
            this.karten.push(new Karte(KartenTyp.blau, j + 1))
            this.karten.push(new Karte(KartenTyp.gruen, j + 1))
        }
        this.karten = shuffle(this.karten)
    }

    /**
     * @returns Die uebrige anzahl an Karten im Deck
     */
    public getAnzahlKarten(): number {
        return this.karten.length
    }

    /**
     * @returns Eine zufaellige Karte aus dem Deck.
     * @throws Wenn das Deck leer ist.
     */
    public zieheKarte(): Karte {
        let karte = this.karten.pop()
        if (karte) {
            return karte
        } else {
            throw Error('Das Deck ist leer')
        }
    }
}