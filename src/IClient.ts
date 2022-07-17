import KartenTyp from "./KartenTyp";
import { KartenNachricht, SpielNachricht } from "./Nachricht";

export default interface IClient {
    sendeSpiel(nachricht: SpielNachricht): void
    sendeHand(nachricht: KartenNachricht[]): void
    onStarteSpiel(handler: () => void): void
    onTrumpffarbe(handler: (trumpffarbe: KartenTyp) => void): void
    onVorhersage(handler: (vorhersage: number) => void): void
    onKarte(handler: (karte: KartenNachricht) => void): void
}