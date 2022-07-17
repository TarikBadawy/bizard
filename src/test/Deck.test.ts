import Deck from "../Deck"

let deck = new Deck()

test('Deck wird mit richtiger groesse erstellt', () => {
    expect(deck.getAnzahlKarten()).toBe(60)
})

test('Karten werden richtig aus dem Deck gezogen', () => {
    const uebrigeKarten = deck.getAnzahlKarten()
    for (let i = 0; i < uebrigeKarten; i++) {
        expect(deck.getAnzahlKarten()).toBe(uebrigeKarten - i)
        expect(deck.zieheKarte()).toBeTruthy()
    }
    expect(deck.getAnzahlKarten()).toBe(0)
    expect(() => deck.zieheKarte()).toThrow()
})