import Spieler from "../Spieler";
import SpielerQueue from "../SpielerQueue";

const spieler1 = new Spieler('Shrek')
const spieler2 = new Spieler('Fiona')
const spieler3 = new Spieler('Esel')
const spieler4 = new Spieler('Lord Farquaad')

const reihenfolge = [spieler1, spieler2, spieler3, spieler4]
const queue = new SpielerQueue(reihenfolge)

test('konstruktor', () => {
    expect(queue.getAktiverSpieler()).toBe(spieler1)
    expect(() => new SpielerQueue([])).toThrow()
})

test('getAktiverSpieler(), getRestlicheSpieler(), naechsterSpieler(), beendet()', () => {
    expect(queue.beendet()).toBe(false)
    expect(queue.getAktiverSpieler()).toBe(spieler1)
    expect(queue.getRestlichenSpieler()).toStrictEqual([spieler2, spieler3, spieler4])
    expect(queue.naechsterSpieler()).toBe(spieler2)
    expect(queue.beendet()).toBe(false)
    expect(queue.getAktiverSpieler()).toBe(spieler2)
    expect(queue.getRestlichenSpieler()).toStrictEqual([spieler3, spieler4])
    expect(queue.naechsterSpieler()).toBe(spieler3)
    expect(queue.beendet()).toBe(false)
    expect(queue.getAktiverSpieler()).toBe(spieler3)
    expect(queue.getRestlichenSpieler()).toStrictEqual([spieler4])
    expect(queue.naechsterSpieler()).toBe(spieler4)
    expect(queue.beendet()).toBe(true)
    expect(queue.getAktiverSpieler()).toBe(spieler4)
    expect(queue.getRestlichenSpieler()).toStrictEqual([])
    expect(() => queue.naechsterSpieler()).toThrow()
})