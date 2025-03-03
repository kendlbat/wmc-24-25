# Refactoring in Microservices

## Ausgangspunkt - Backend mit monolitischer Architektur

Das bestehende Backend des Online-Shops kann man als trivialen Monolithen betrachten, der als Hauptfunktionalität
die Verwaltung der Produkte als auch die Erfassung von Ratings bietet.

Das folgende Sequenzdiagramm zeigt einen Ausschnitt der möglichen HTTP Requests der REST API und der Interaktion
mit der Datenbank.

```plantuml
participant Client
box Monolith
participant Backend
database DB
end box

Client -> Backend : GET </api/products/1234
activate Backend
Backend -> DB : Product.findById(...)
DB -> Backend
Backend -> Client: 200 OK \n {productId: 1234, name: "Keyboard", \n price: 19.90}
deactivate Backend

Client -> Backend : GET /api/products/1234/ratings
activate Backend
Backend -> DB : Rating.find(...)
DB -> Backend
Backend -> Client: 200 OK \n [ {numStars: 3}, {numStars: 5} ]
deactivate Backend


Client -> Backend : GET /api/products/1234/ratings/summary
activate Backend
Backend -> DB : Rating.find(...)
DB -> Backend
Backend -> Client: 200 OK \n {numRatings: 2, avgStars: 4}
deactivate Backend

```

### Aufsplitten in einzelne Microservices

Teilen sie die bestehende Implementierung des Backends in zwei voneinander unabhängige Microservices  _Products_ bzw. _Ratings_. Legen Sie die beiden Implementierungen in den Verzeichnissen `microservices/products` und `microservices/ratings` ab. Diese sollten wie gewohnt mittels `npm run fill-demo-data` und `npm run start` gestartet werden können.

Starten Sie die Services und die dazugehörigen Instanzen der Datenbank unter folgenden Ports

*   ProductService - Port 5000
*   ProductDB - Port 5001
*   RatingService - Port 6000
*   RatingDB - Port 6001

Erstellen Sie eine Datei `microservices/requests.rest`, um die HTTP Requests mit den neuen Microservices und geänderten Ports zu testen.

Die daraus resultierende Interaktion mit den Microservices kann wie folgt dargestellt werden.

```plantuml
skinparam BoxPadding 20

participant Client
box Products
participant ProductService
database ProductDB
end box 

box Ratings
participant RatingService
database RatingDB
end box

Client -> ProductService : GET /api/products/1234
activate ProductService
ProductService -> ProductDB : Product.findById(...)
ProductDB -> ProductService
ProductService -> Client: 200 OK \n {productId: 1234, name: "Keyboard", \n price: 19.90}
deactivate ProductService

Client -> RatingService : GET /api/products/1234/ratings
activate RatingService
RatingService -> RatingDB : Rating.find(...)
RatingDB -> RatingService
RatingService -> Client: 200 OK \n [ {rating: 3}, {rating: 5} ]
deactivate RatingService
```

## Containerisierung

Erstellen Sie entsprechende Dockerfiles für die beiden Microservices und testen Sie die Ausführung erneut.
Dokumentieren Sie die dafür verwendeten `docker` Kommandos in der Datei `microservices/how-to-run.md`.
