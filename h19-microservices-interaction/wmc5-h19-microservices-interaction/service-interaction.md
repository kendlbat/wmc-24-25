# Interaktion zwischen Services

Erweitern Sie sowohl in der monolithischen als auch Microservice-basierten Implementierung
die Funktionalität des `GET /api/products/:id` Endpunkts. Es sollte nun zusätzlich die Bewertung
in Form der durchschnittlichen Sterne-Anzahl zurückgeliefert werden bzw. `0`, wenn das Produkt
noch nicht bewertet wurde.

Beispiel eines Response:

```json
{
    "productId": "1234",
    "name": "Keyboard",
    "price": 19.90,
    "avgStars": 4
}
```

Im Falle der monolithischen Implementierung kann die bestehende `getSummaryForProduct` Funktion
wiederverwendet werden.

Im Falle der Microservice-basierten Implementierung wird es notwendig werden, einen HTTP Request
zum _RatingService_ abzusetzen, wie im Sequenzdiagramm dargestellt.

Hinweise zur Implementierung:

*   Verwenden Sie die _fetch_ API, um einen HTTP Request abzusetzen.
*   Beachten Sie, dass die Verwendung von _fetch_ in Kombination mit bestimmten _Bad Ports_ wie 6000 zu Problemen führt.
*   Kapseln Sie die Implementierung in einer Funktion `getSummaryForProductREST`.
*   Die URL des _RatingService_ sollte über die Umgebungsvariable `RATING_SERVICE_URL` gesetzt werden können.
*   Überlegen Sie, welche Fehler auftreten können und implementieren Sie ein geeignetes Fehlerhandling.

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
APIGateway -> ProductService : GET /api/products/1234
activate ProductService
ProductService -> ProductDB : Product.findById(...)
ProductDB -> ProductService
ProductService -> RatingService: GET /api/products/1234/summary

activate RatingService
RatingService -> RatingDB : Rating.find(...)
RatingDB -> RatingService
RatingService -> ProductService: 200 OK \n {avgStars: 4, numRatings: 2}
deactivate RatingService

ProductService -> Client: 200 OK \n {productId: 1234, name: "Keyboard", \n price: 19.90, avgStars: 4}
deactivate ProductService

```
