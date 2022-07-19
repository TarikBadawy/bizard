import React, { useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client"
import type Karte from "../../src/Karte"
import type KartenTyp from "../../src/KartenTyp"
import './App.css'

enum Zustand {
  wilkommen,
  menu,
  lobby,
  spiel,
  ende
}

function App() {
  const [socket] = useState<Socket>(io('localhost:80'))
  const [zustand, setZustand] = useState<Zustand>(Zustand.wilkommen)
  const [id, setId] = useState<string>('')
  const [raume, setRaeume] = useState<[string, string][]>([])
  const [spiel, setSpiel] = useState<any>()
  const [hand, setHand] = useState<string[]>([])
  const [name, setName] = useState<string>('')
  const [runden, setRunden] = useState<number>(0)
  const [vorhersage, setVorhersage] = useState<number>(0)

  function erstelleSpiel(name: string, runden: number): void {
    socket.emit('erstelle', name, +runden)
  }

  function fuegeBotHinzu(): void {
    socket.emit('bot')
  }

  function starteSpiel(): void {
    socket.emit('starte')
  }

  function treteSpielBei(name: string, id: string): void {
    socket.emit('beitreten', name, id)
  }

  function waehleTrumpf(trumpffarbe: KartenTyp) {
    socket.emit('trumpffarbe', trumpffarbe)
  }

  function macheVorhersage(vorhersage: number) {
    socket.emit('vorhersage', +vorhersage)
  }

  function spieleKarte(karte: Karte) {
    socket.emit('karte', karte)
  }

  useEffect(() => {
    socket.onAny(console.log)
    socket.on('id', setId)
    socket.on('hand', setHand)
    socket.on('raeume', setRaeume)
    socket.on('spiel', (spiel) => {
      if (spiel.ausloeser === 'rundeBeendet') {
        spiel.runde = spiel.runden.at(-1).runde
        spiel.runde.stich = spiel.runde.stiche.at(-1).stich
      } else if (spiel.ausloeser === 'stichBeendet') {
        spiel.runde.stich = spiel.runde.stiche.at(-1).stich
      }
      setSpiel(spiel)
      if (spiel.erwarte === 'start') {
        setZustand(Zustand.lobby)
      } else if (spiel.erwarte === 'ende') {
        setZustand(Zustand.ende)
      } else {
        setZustand(Zustand.spiel)
      }
    })
  }, [socket])

  return (
    <>
      {zustand === Zustand.wilkommen && <>
        Wilkommen bei Bizard. Wie ist dein Name?
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text" placeholder="Name"
        />
        <button onClick={() => setZustand(Zustand.menu)}>Spielen</button>
      </>}
      {zustand === Zustand.menu && <>
        Möchtest du ein Spiel erstellen oder beitreten?
        <input
          value={runden}
          onChange={e => setRunden(+e.target.value)}
          type="number" min="0" max="14" placeholder="Runden"
        />
        <button onClick={() => erstelleSpiel(name, runden)}>Spiel erstellen</button>
        {raume.map(([raumId, raumName]) => (
          <button key={raumId} onClick={() => treteSpielBei(name, raumId)}>
            {raumName}
          </button>
        ))}
      </>}
      {zustand === Zustand.lobby && <>
        Lobby
        <ul>
          {spiel.spieler.map((spieler: any) => <li key={spieler.id}>{spieler.name}</li>)}
        </ul>
        <button onClick={fuegeBotHinzu}>Bot hinzufügen</button>
        <button onClick={starteSpiel}>Start</button>
      </>}
      {zustand === Zustand.spiel && <>
        Runde: {spiel.runde.rundenNummer} / {spiel.rundenAnzahl}
        <table>
          <tr>
            <th>Name</th>
            <th>Punkte</th>
            <th>Vorhersage</th>
            <th>Stich</th>
          </tr>
          {spiel.spieler.map((spieler: any) => {
            const aktiv = spieler.id === spiel.runde.aktiverSpieler.id
            return <tr key={spieler.id}>
              <td>{aktiv ? <b>{spieler.name}</b> : spieler.name}</td>
              <td>{spiel.punkteListe.find((l: any) => spieler.id === l.spieler.id).punkte}</td>
              <td>{spiel.runde.vorhersagen.find((v: any) => spieler.id === v.spieler.id)?.vorhersage ?? '-'}</td>
              <td>{spiel.runde.stiche.filter((s: any) => spieler.id === s.gewinner.id).length}</td>
            </tr>
          })}
        </table>
        Trumpffarbe: {spiel.runde.trumpffarbe.toUpperCase().replace('UE', 'Ü')} <br></br>
        Stich:
        <ol>
          {spiel.runde.stich.map((s: any) => (
            <li key={s.spieler.id}>
              {s.spieler.name}: {s.karte.typ} {s.karte.wert}
            </li>
          ))}
        </ol>
        {spiel.runde.aktiverSpieler.id === id && spiel.erwarte === 'trumpf' && <>
          <button onClick={() => waehleTrumpf('rot' as KartenTyp)}>ROT</button>
          <button onClick={() => waehleTrumpf('gruen' as KartenTyp)}>GRÜN</button>
          <button onClick={() => waehleTrumpf('blau' as KartenTyp)}>BLAU</button>
          <button onClick={() => waehleTrumpf('gelb' as KartenTyp)}>GELB</button>
        </>}
        {spiel.runde.aktiverSpieler.id === id && spiel.erwarte === 'vorhersage' && <>
          <input
            value={vorhersage}
            onChange={e => setVorhersage(+e.target.value)}
            type="number" min="0" placeholder="Vorhersage"
          />
          <button onClick={() => macheVorhersage(vorhersage)}>Mache Vorhersage</button>
        </>}
        Hand:<br></br>
        {hand.map((karte: any, index) => {
          const amZug = spiel.runde.aktiverSpieler.id === id
          const trumpf = karte.typ === 'bizard' || karte.typ === 'barr' || karte.typ === spiel.runde.trumpffarbe
          const kannBedienen = hand.find((karte: any) => karte.typ === spiel.runde.angespielteFarbe) !== undefined
          const bedient = karte.typ === spiel.runde.angespielteFarbe
          const spielbar = amZug && spiel.erwarte === 'karte' && (trumpf || !kannBedienen || bedient)
          return (
            <button key={index} disabled={!spielbar} onClick={() => spieleKarte(karte)}>
              {karte.typ} {karte.wert}
            </button>
          )
        })}
      </>}
      {zustand === Zustand.ende && <>
        <table>
          <tr>
            <th>Runde</th>
            {spiel.spieler.map((spieler: any) => <th key={spieler.id}>{spieler.name}</th>)}
          </tr>
          {spiel.runden.map((runde: any) => (
            <tr>
              <td>{runde.nummer}</td>
              {runde.punkteListe.map((l: any) => <td key={l.spieler.id}>{l.punkte}</td>)}
            </tr>
          ))}
          <tr>
            <td><b>Gesamt</b></td>
            {spiel.punkteListe.map((l: any) => <td key={l.spieler.id}><b>${l.punkte}</b></td>)}
          </tr>
        </table>
        <button>Beenden</button>
      </>}
    </>
  )
}

export default App