import Deck from "../Deck"

let deck = new Deck()

test('Karten werden richtig aus dem Deck gezogen', () => {
    const karten = 60
    for (let i = 0; i < karten; i++) {
        expect(deck.zieheKarte()).toBeTruthy()
    }
    expect(() => deck.zieheKarte()).toThrow()
})