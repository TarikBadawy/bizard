import KartenTyp from "./KartenTyp";
import { KartenNachricht, SpielNachricht } from "./Nachricht";

/**
 * Ein Interface zur Modelliwrung eines Clients. Ein Client ist dafür zuständig den
 * Spielzustand und die Spielerhand dem physischen spieler zu senden. Zudem können
 * Event Handler, für die Aktionen die der Spieler durchführen kann, gesetzt werden.
 */
export default interface IClient {
    /**
     * Sende dem Spieler den Zustand des Spiels
     * @param nachricht Der Zustand des Spiels
     */
    sendeSpiel(nachricht: SpielNachricht): void

    /**
     * Sende dem Spieler seine Hand
     * @param nachricht Die Hand vom Spieler
     */
    sendeHand(nachricht: KartenNachricht[]): void

    /**
     * @param handler Der Handler der ausgeführt wird, sobald der Spieler probiert
     * das Spiel zu starten.
     */
    onStarteSpiel(handler: () => void): void
    
    /**
     * @param handler Der Handler der ausgeführt wird, sobald der Spieler probiert
     * den Trumpf zu setzen.
     */
    onTrumpffarbe(handler: (trumpffarbe: KartenTyp) => void): void

    /**
     * @param handler Der Handler der ausgeführt wird, sobald der Spieler probiert
     * eine Vorhersage zu machen.
     */
    onVorhersage(handler: (vorhersage: number) => void): void

    /**
     * @param handler Der Handler der ausgeführt wird, sobald der Spieler probiert
     * eine Karte zu legen.
     */
    onKarte(handler: (karte: KartenNachricht) => void): void
}