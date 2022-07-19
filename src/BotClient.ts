import IClient from "./IClient";
import Karte from "./Karte";
import KartenTyp from "./KartenTyp";
import { KartenNachricht, SpielNachricht } from "./Nachricht";

/** Ein Client, welcher zufällige und valide Aktionen durchführt. */
export default class BotClient implements IClient {
    private id: string
    private hand: KartenNachricht[]
    public starteSpiel: () => void
    private setzeTrumpffarbe: (trumpffarbe: KartenTyp) => void
    private macheVorhersage: (vorhersage: number) => void
    private spieleKarte: (karte: KartenNachricht) => void

    public constructor(id: string) {
        this.id = id
        this.hand = []
        this.starteSpiel = () => {}
        this.setzeTrumpffarbe = () => {}
        this.macheVorhersage = () => {}
        this.spieleKarte = () => {}
    }

    public onStarteSpiel(handler: () => void): void {
        this.starteSpiel = handler
    }

    public onTrumpffarbe(handler: (trumpffarbe: KartenTyp) => void): void {
        this.setzeTrumpffarbe = handler
    }

    public onVorhersage(handler: (vorhersage: number) => void): void {
        this.macheVorhersage = handler
    }

    public onKarte(handler: (karte: KartenNachricht) => void): void {
        this.spieleKarte = handler
    }

    public sendeSpiel(nachricht: SpielNachricht) {
        if (process.env.NODE_ENV == 'test') {
            this.macheZug(nachricht)
        } else {
            setTimeout(() => this.macheZug(nachricht), 3000)
        }
    }
    
    public sendeHand(hand: KartenNachricht[]): void {
        this.hand = hand
    }
    
    private macheZug(nachricht: SpielNachricht) {
        const runde = nachricht.runde;
        if (runde != undefined && runde.aktiverSpieler.id == this.id) {
            switch (nachricht.erwarte) {
                case 'trumpf':
                    this.setzeTrumpffarbe(this.zufaelligerTrumpf(this.hand))
                    break;
                case 'vorhersage':
                    this.macheVorhersage(this.zufaelligeVorhersage(runde.rundenNummer))
                    break
                case 'karte':
                    this.spieleKarte(this.zufaelligeKarte(this.hand, runde.angespielteFarbe))
                default:
                    break;
            }
        }
    }

    private zufaelligerTrumpf(hand: KartenNachricht[]) {
        for (const karte of hand) {
            if (Karte.istFarbe(karte.typ)) {
                return karte.typ
            }
        }
        return KartenTyp.blau
    }

    private zufaelligeVorhersage(runde: number): number {
        return Math.floor(Math.random() * (runde + 1))
    }

    private zufaelligeKarte(hand: KartenNachricht[], angespielt?: KartenTyp): KartenNachricht {
        if (angespielt != undefined) {
            for (const karte of hand) {
                if (karte.typ == angespielt || Karte.istFarbe(karte.typ) == false) {
                    return karte
                }
            }
        }
        return hand[0]
    }
}