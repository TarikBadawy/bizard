import { Socket } from "socket.io";
import IClient from "./IClient";
import KartenTyp from "./KartenTyp";
import { KartenNachricht, SpielNachricht } from "./Nachricht";

/** Der Client, der sich mit einem Websocket vom Nutzer verbindet. */
export default class Client implements IClient {
    private readonly socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }
    
    public sendeSpiel(nachricht: SpielNachricht): void {
        this.socket.emit('spiel', nachricht)
    }
    
    public sendeHand(nachricht: KartenNachricht[]): void {
        this.socket.emit('hand', nachricht)
    }
    
    public onStarteSpiel(handler: () => void): void {
        this.socket.on('starte', handler)
    }
    
    public onTrumpffarbe(handler: (trumpffarbe: KartenTyp) => void): void {
        this.socket.on('trumpffarbe', handler)
    }
    
    public onVorhersage(handler: (vorhersage: number) => void): void {
        this.socket.on('vorhersage', handler)
    }
    
    public onKarte(handler: (karte: KartenNachricht) => void): void {
        this.socket.on('karte', handler)
    }
    
    /**
     * Der Nutzer ist dazu in der Lage Bots zum Spiel hinzuzufügen.
     * @param handler Der Handler der ausgeführt wird, sobald der Spieler probiert
     * einen Bot zum Spiel hinzuzufügen.
     */
    public onBotHinzufuegen(handler: () => void): void {
        this.socket.on('bot', handler)
    }
}