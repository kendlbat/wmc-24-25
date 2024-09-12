# HTTP Basics & Express Middleware - Cars Service

In dieser Übung muss ein Cars-Service mit Express.js implementiert werden. Der Service soll die grundlegenden CRUD-Operationen (Create, Read, Update, Delete) über eine REST-API bereitstellen.

## Prerequisites

Führen Sie in dieser Übung vorab folgende Tasks durch

- node auf Version 22 upgraden
- express und nodemon korrekt als Abhängigkeiten installieren
- ES6 Modules Kapitel lesen und verwenden. Auf <https://nodejs.org/en> finden Sie das neue "Hello World" Programm.
- Express Middleware - Kapitel lesen <https://expressjs.com/en/guide/using-middleware.html>

## Tasks

- Implementierung Sie für das Cars-Service die Operationen `in-memory`, von einer dauerhaften Speicherung kann abgesehen werden.
- Implementierung Sie eine Middleware für das Logging mit Fokus auf HTTP Methoden-Eigenschaften.
- Implementierung Sie eine Middleware, die abprüft, ob bei HTTP-Methoden, die als `nicht safe` gelten, ein API Key verwendet wurde.
- Richten Sie `npm start` und `npm dev` als `npm scripts` ein
- Erstellen Sie eine REST - Testdatei für die VS-Code-Extension

## Logging-Output

Im Logging sollen nicht nur Informationen über den _request_, sondern auch Informationen über das Ergebnis der Operation aus der _response_ ersichtlich sein.

Dazu müssen Sie jeden Request mit einer laufenden `id` versehen, um die Antwort eindeutig der Anfrage zuordnen zu können.

Im Request soll des weiteren bei jeder Methode mitgeloggt werden, welche Eigenschaften zutreffend sind: `idempotent`, `safe`, `cacheable`.

### Beispieloutput

```text
1000: 07:44:01,094 GET /cars - safe, idempotent, cacheable
1000: 07:44:01,106 StatusCode: 200

1001: 07:44:01,130 GET /cars/2 - safe, idempotent, cacheable
1001: 07:44:01,133 StatusCode: 200

1002: 07:44:01,142 GET /cars/324545 - safe, idempotent, cacheable
1002: 07:44:01,145 StatusCode: 404

1003: 07:44:01,172 POST /cars - 
1003: 07:44:01,174 StatusCode: 201

1004: 07:44:01,183 POST /cars - 
1004: 07:44:01,184 StatusCode: 400

1005: 07:44:01,192 POST /cars -
1005: 07:44:01,193 StatusCode: 403

1006: 07:44:01,204 PUT /cars/2 - idempotent
1006: 07:44:01,206 StatusCode: 200

1007: 07:44:01,216 PUT /cars/2 - idempotent
1007: 07:44:01,218 StatusCode: 400

1008: 07:44:01,232 PUT /cars/2 - idempotent
1008: 07:44:01,234 StatusCode: 403

1009: 07:44:01,247 PUT /cars/2324243 - idempotent
1009: 07:44:01,249 StatusCode: 404

1010: 07:44:01,260 DELETE /cars/2 - idempotent
1010: 07:44:01,262 StatusCode: 204

1011: 07:44:01,270 DELETE /cars/22342 - idempotent
1011: 07:44:01,272 StatusCode: 404

1012: 07:44:01,277 DELETE /cars/1 - idempotent
1012: 07:44:01,280 StatusCode: 403
```

## Car - Model

Das Car-Model soll sehr einfach gehalten werden. Es reicht ein Objekt mit einer Id und einer Namenseigenschaft.
Der Name muss allerdings eindeutig in der Collection sein.

Führen Sie in den relevanten HTTP-Methoden die entsprechenden Checks durch.
