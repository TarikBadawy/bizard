function onSpielErstellen() {
    const name = $('#name').val()
    const runden = $('#runden').val()
    socket.emit('erstelle', name, +runden)
}

function onBotHinzufuegen() {
    socket.emit('bot')
}

function onSpielStart() {
    socket.emit('starte')
}

function onSpielBeitreten(id) {
    const name = $('#name').val()
    socket.emit('beitreten', name, id)
}

function onTrumpf(trumpffarbe) {
    socket.emit('trumpffarbe', trumpffarbe)
}

function onVorhersage() {
    const vorhersage = $('#vorhersage input').val()
    socket.emit('vorhersage', +vorhersage)
}

function onKarte(karte) {
    socket.emit('karte', karte)
}