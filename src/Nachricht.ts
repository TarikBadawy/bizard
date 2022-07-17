import Karte from './Karte'
import KartenTyp from './KartenTyp'
import Runde from './Runde'
import Spieler from "./Spieler"
import Stich from './Stich'
import Spiel from './Spiel'
import PunkteListe from './PunkteListe'

export enum Aktion {
    spieler = 'spieler',
    start = 'start',
    trumpf = 'trumpf',
    vorhersage = 'vorhersage',
    karte = 'karte',
    stichBeendet = 'stichBeendet',
    rundeBeendet = 'rundeBeendet',
    ende = 'ende'
}

export type SpielNachricht = {
    spieler: SpielerNachricht[]
    rundenAnzahl: number
    runde: RundeNachricht | undefined
    runden: { runde: RundeNachricht, punkteListe: PunkteListeNachricht }[]
    punkteListe: PunkteListeNachricht
    ausloeser: Aktion
    erwarte: Aktion.start | Aktion.trumpf | Aktion.vorhersage | Aktion.karte | Aktion.ende
}

export type RundeNachricht = {
    rundenNummer: number
    aktiverSpieler: SpielerNachricht
    warteschlange: SpielerNachricht[]
    stich: StichNachricht
    stiche: StichListeNachricht
    vorhersagen: VorhersagenNachricht
    trumpffarbe: KartenTyp
    angespielteFarbe: KartenTyp | undefined
    beendet: boolean
}

export type PunkteListeNachricht = {
    spieler: SpielerNachricht,
    punkte: number
}[]

export type StichNachricht = {
    spieler: SpielerNachricht,
    karte: KartenNachricht
}[]

export type StichListeNachricht = {
    gewinner: SpielerNachricht,
    stich: StichNachricht
}[]

export type VorhersagenNachricht = {
    spieler: SpielerNachricht,
    vorhersage: number
}[]

export type SpielerNachricht = {
    id: string
    name: string
}

export type KartenNachricht = {
    typ: KartenTyp
    wert: number
}

export function spielNachricht(spiel: Spiel, aktion: Aktion): SpielNachricht {
    let erwarte = Aktion.start
    let runde = undefined
    if (spiel.gestartet() == false) {
        erwarte = Aktion.start
    } else {
        runde = rundeNachricht(spiel.getRunde())
        if (runde.trumpffarbe == KartenTyp.bizard) {
            erwarte = Aktion.trumpf
        } else if (runde.vorhersagen.length != spiel.getReihenfolge().length) {
            erwarte = Aktion.vorhersage
        } else if (!runde.beendet && runde.rundenNummer <= spiel.getRundenAnzahl()) {
            erwarte = Aktion.karte
        } else {
            erwarte = Aktion.ende
        }
    }
    return {
        spieler: spiel.getReihenfolge().map(spielerNachricht),
        rundenAnzahl: spiel.getRundenAnzahl(),
        runden: Array.from(spiel.getRunden()).map(([runde, punkte]) => ({
            runde: rundeNachricht(runde),
            punkteListe: punkteListeNachricht(punkte)
        })),
        punkteListe: punkteListeNachricht(spiel.getPunkteListe()),
        ausloeser: aktion,
        erwarte,
        runde
    }
}

export function rundeNachricht(runde: Runde): RundeNachricht {
    const warteschlange = runde.getWarteschlange()
    return {
        rundenNummer: runde.getRundenNummer(),
        aktiverSpieler: spielerNachricht(warteschlange.getAktiverSpieler()),
        warteschlange: warteschlange.getRestlichenSpieler().map(spielerNachricht),
        stich: stichNachricht(runde.getAktivenStich()),
        stiche: stichListeNachricht(runde.getVergebeneStiche()),
        vorhersagen: vorhersagenhNachricht(runde.getVorhersagen()),
        trumpffarbe: runde.getTrumpffarbe(),
        angespielteFarbe: runde.getAktivenStich().getAngespielteFarbe(),
        beendet: runde.beendet(),
    }
}

function punkteListeNachricht(punkte: PunkteListe): PunkteListeNachricht {
    return Array.from(punkte.entries()).map(([spieler, punkte]) => ({
        spieler: spielerNachricht(spieler),
        punkte
    }))
}

function vorhersagenhNachricht(vorhersagen: Map<Spieler, number>): VorhersagenNachricht {
    return Array.from(vorhersagen.entries()).map(([spieler, vorhersage]) => ({
        spieler: spielerNachricht(spieler),
        vorhersage
    }))
}

function stichListeNachricht(stiche: Map<Stich, Spieler>): StichListeNachricht {
    return Array.from(stiche.entries()).map(([stich, gewinner]) => ({
        stich: stichNachricht(stich),
        gewinner: spielerNachricht(gewinner)
    }))
}

function stichNachricht(stich: Stich): StichNachricht {
    return Array.from(stich.entries()).map(([spieler, karte]) => ({
        spieler: spielerNachricht(spieler),
        karte: kartenNachricht(karte)
    }))
}

export function spielerNachricht(spieler: Spieler): SpielerNachricht {
    return {
        id: spieler.getId(),
        name: spieler.getName()
    }
}

export function kartenNachricht(karte: Karte): KartenNachricht {
    return {
        typ: karte.getTyp(),
        wert: karte.getWert()
    }
}