function getEndeHtml(spiel) {
    let tableHtml = '<tr><th>Runde</th>'
    tableHtml += spiel.spieler.map(({name}) => `<th>${name}</th>`)
    tableHtml += '</tr>'
    for (let i = 0; i < spiel.runden.length; i++) {
        tableHtml += '<tr><td>' + (i+1) + '</td>'
        for (const { punkte } of spiel.runden[i].punkteListe) {
            tableHtml += '<td>' + (punkte > 0 ? '+' : '') + punkte + '</td>'
        }
        tableHtml += '</tr>'
    }
    tableHtml += '<tr><td>Gesamt</td>'
    tableHtml += spiel.punkteListe.map(({punkte}) => `<td><b>${punkte}</b</td>`).join('')
    tableHtml += '</tr>'
    return tableHtml
}

function getSpielerTabelleHtml(spiel) {
    const runde = spiel.runde
    let tableHtml = '<tr><th>Name</th><th>Punkte</th><th>Vorhersage</th><th>Stiche</th></th>'
    for (const s of spiel.spieler) {
        const punkte = spiel.punkteListe.find(({ spieler }) => spieler.id == s.id).punkte
        const vorhersage = runde.vorhersagen.find(({ spieler }) => spieler.id == s.id)?.vorhersage ?? '-'
        const stiche = runde.stiche.filter(({ gewinner }) => gewinner.id == s.id).length
        const aktiv = s.id == runde.aktiverSpieler.id
        const name = aktiv ? `<b>${s.name}</b>` : s.name
        tableHtml += '<tr>'
        tableHtml += [name, punkte, vorhersage, stiche].map(str => `<td>${str}</td>`).join('')
        tableHtml += '</tr>'
    }
    return tableHtml
}

function getStichHtml(stich) {
    return stich.map(({spieler, karte}) =>  `<li>${spieler.name}: ${karte.typ} ${karte.wert}</li>`)
}

function getHandHtml(spiel, hand) {
    const runde = spiel.runde
    return hand.map(karte => {
        const amZug = runde.aktiverSpieler.id == _id
        const trumpf = karte.typ == 'bizard' || karte.typ == 'barr' || karte.typ == runde.trumpffarbe
        const kannBedienen = _hand.find(karte => karte.typ == runde.angespielteFarbe) != undefined
        const bedient = karte.typ == runde.angespielteFarbe
        const text = karte.typ + ' ' + karte.wert
        const spielbar = amZug && spiel.erwarte == 'karte' && (trumpf || !kannBedienen || bedient)
        return `<button ${spielbar ? '' : 'disabled'} onclick=onKarte(${JSON.stringify(karte)});>${text}</button>`
    }).join('')
}