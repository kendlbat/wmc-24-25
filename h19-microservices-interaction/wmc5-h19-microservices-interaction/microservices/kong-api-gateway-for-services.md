# API Gateway für Microservices

Installieren Sie Kong unter Verwendung von Docker und der PostgreSQL Datenbank.
Vergewissern Sie sich, dass Sie die Anleitung für Open Source Variante (OSS) verwenden.

Konfigurieren Sie das Kong API Gateway dahingehend, dass Sie sowohl das _Product Service_
als auch das _Rating Service_ über das API Gateway integrieren.

```plantuml
skinparam BoxPadding 20

participant Client
participant APIGateway
box Products
participant ProductService
database ProductDB
end box 

box Ratings
participant RatingService
database RatingDB
end box

Client -> APIGateway : GET /api/products/1234
activate APIGateway
APIGateway -> ProductService : GET /api/products/1234
activate ProductService
ProductService -> ProductDB : Product.findById(...)
ProductDB -> ProductService
ProductService -> APIGateway: 200 OK \n {productId: 1234, name: "Keyboard", \n price: 19.90}
deactivate ProductService
APIGateway -> Client: 200 OK \n {productId: 1234, name: "Keyboard", \n price: 19.90}
deactivate APIGateway


Client -> APIGateway : GET /api/products/1234/ratings
activate APIGateway
APIGateway -> RatingService : GET /api/products/1234/ratings
activate RatingService
RatingService -> RatingDB : Rating.find(...)
RatingDB -> RatingService
RatingService -> APIGateway: 200 OK \n [ {rating: 3}, {rating: 5} ]
deactivate RatingService
APIGateway -> Client: 200 OK \n [ {rating: 3}, {rating: 5} ]
deactivate APIGateway
```

Hinweise:

*   Entfernen Sie zunächst alle Services und Routen in Kong, damit es zu keinen Konflikten in der Konfiguration kommt.
*   Verwenden Sie für alle Container der Einfachheit halber das Netzwerk `kong-net`.
*   Für diese Aufgabe ist es ausreichend, nur eine Instanz jedes Services zu verwenden.
  Es ist kein Load Balancing erforderlich.

## Product Service

Vorbereitungen:

*   Starten Sie eine Instanz des MongoDB Container Images. Verwenden Sie für den Container den Namen `product-db`.
*   Füllen Sie die Datenbank mit den entsprechenden Demodaten.  
*   Starten Sie eine Instanz des _Product Service_ Container Images unter Verwendung des Namens `product-service`.

Konfigurieren Sie in Kong ein entsprechendes Service und die dazugehörende Route.

Sie können Ihre Konfiguration testen, indem Sie einen Request auf `http://127.0.0.1:8000/api/products` absetzen.

Dokumentieren Sie die notwendigen Kommandos bzw. die HTTP Requests zur Konfiguration von Kong in der Datei `api-gateway-services.md`, sodass Sie die Schritte im Unterricht nachvollziehbar präsentieren können.

## Rating Service

Gehen sie hier analog vor wie beim _Product Service_. Verwenden Sie als Namen für die Container `rating-db`
und `rating-service`.

Beachten Sie, dass die Ratings eine Sub-Ressource unter `/api/products` darstellen. Ein einfaches Mapping mit einem statischen String
ist an dieser Stelle daher nicht mehr möglich. Kong erlaubt es daher, _regular expressions_ zu verwenden. Um die Verwendung dieser zu
signalisieren, muss der Pfad der Route jedoch mit einer `~` beginnen wie z.B. `~/api/products/...`.

Sie können Ihre Konfiguration testen, indem Sie einen Request auf `http://127.0.0.1:8000/api/products/1234/ratings` absetzen.
Der Zugriff auf das _Product Service_ sollte natürlich immer noch möglich sein.

Ergänzen Sie die Dokumentation in der Datei `api-gateway-services.md`, sodass Sie die Schritte im Unterricht nachvollziehbar präsentieren können.
