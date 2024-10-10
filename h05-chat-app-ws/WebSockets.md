# Chat Applikation mit WebSockets

## Aufgabenstellung

Implementieren Sie die Chat Applikation unter Verwendung von WebSockets.
Beachten Sie, dass aber trotzdem noch ein HTTP-Server verwendet werden muss, damit
der Client an den Browser ausgeliefert werden kann. Für die weitere Kommunikation
soll aber ausschließlich ein WebSocket verwendet werden.

Verwenden Sie folgende vereinfachte Vorgehensweise

* Alle Nachrichten werden als JSON-Objekte über das WebSocket gesendet.
* Wenn sich ein neuer Client verbindet, sendet der Server alle bereits existierenden Messages an den Client.
* Wenn der Client eine neue Nachricht an den Server schickt, verteilt dieser die Nachricht an alle verbundenen Clients.

## Implementierungshinweise

Verwenden Sie für den Server das Package `express-ws`, welches über `npm` installiert
werden muss. Das Package integriert die bekannte `ws` WebSocket Library <https://github.com/websockets/ws>
in Express.

```javascript
import express from 'express';
import expWs from 'express-ws';

const expressWs = expWs(app);

// registering all other handlers
app.static(...)
app.get(...)

// register websocket endpoint...
app.ws('/api/messages', (ws, req) => {

})
```

* Auf das _eingebettete_ WebSocket Server Objekt kann mittels `expressWs.getWss()` zugegriffen werden.
* Ein separates Mitführen aller verbundenen Clients muss nicht separat implementiert werden, über das
Server Objekt können alle aktiven Clients abgefragt werden.

