import IClient from "./IClient"
import Karte from "./Karte"
import { Aktion, kartenNachricht, spielNachricht } from "./Nachricht"
import Spiel from "./Spiel"
import Spieler from "./Spieler"

export default class Raum {
    public readonly name: string
    public readonly spiel: Spiel
    private readonly spieler: Map<IClient, Spieler>

    constructor(runden: number, name: string) {
        this.name = name
        this.spiel = new Spiel(runden)
        this.spieler = new Map<IClient, Spieler>()
    }

    public getClients(): IClient[] {
        return Array.from(this.spieler.keys())
    }

    public registriereSpieler(spieler: Spieler, client: IClient): void {
        if (this.spiel.gestartet()) {
            throw Error('Spielt hat bereits begonnen')
        } else if (this.spieler.has(client)) {
            throw Error('Client bereits registriert')
        } else {
            this.spieler.set(client, spieler)
            this.spiel.fuegeSpielerHinzu(spieler)
            client.onStarteSpiel(() => {
                this.spiel.starteSpiel()
                this.sendeZustand(Aktion.start)
            })
            client.onTrumpffarbe(trumpffarbe => {
                this.spiel.getRunde().setzeTrumpffarbe(spieler, trumpffarbe)
                this.sendeZustand(Aktion.trumpf)
            })
            client.onVorhersage(vorhersage => {
                this.spiel.getRunde().macheVorhersage(spieler, vorhersage)
                this.sendeZustand(Aktion.vorhersage)
            })
            client.onKarte(karte => {
                let aktion = Aktion.karte
                const runde = this.spiel.getRunde()
                if (runde.spieleKarte(spieler, new Karte(karte.typ, karte.wert))) {
                    aktion = Aktion.stichBeendet
                }
                if (runde.beendet()) {
                    this.spiel.werteRundeAus()
                    if (this.spiel.beendet() == false) {
                        this.spiel.naechsteRunde()
                    }
                    aktion = Aktion.rundeBeendet
                }
                this.sendeZustand(aktion)
            })
            this.sendeZustand(Aktion.spieler)
        }
    }

    private sendeZustand(aktion: Aktion): void {
        for (const [client, spieler] of this.spieler.entries()) {
            client.sendeHand(spieler.getHand().map(kartenNachricht))
        }
        for (const [client, _] of this.spieler.entries()) {
            client.sendeSpiel(spielNachricht(this.spiel, aktion))
        }
    }
}