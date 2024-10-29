# Optimistic Locking

im Zusammenhang mit dem _lost update_ Problem.

Beim _Optimistic Locking_ wird davon ausgegangen, dass Konflikte bei der Aktualisierung von Ressourcen selten auftreten. Daher wird die Ressource nicht gesperrt, sondern es wird lediglich die Version der Ressource überwacht. Beim Aktualisieren der Ressource wird die Version überprüft und bei einer Konfliktsituation wird die Aktualisierung abgebrochen und eine Fehlermeldung zurückgegeben. Der Client muss dann die Ressource erneut abrufen und die Änderungen erneut durchführen.

```plantuml
@startuml
participant Client1
participant Server
participant Client2

Client1 -> Server: GET /api/resource
Server -> Client1: 200 OK\nETag: "1"
Client2 -> Server: GET /api/resource
Server -> Client2: 200 OK\nETag: "1"
Client1 -> Server: PUT /api/resource\nIf-Match: "1"
note right of Client1 : Client1 verändert die Ressource, und sendet die\nVersion der Ressource mit, die er beim\nAbrufen erhalten hat.
Server -> Client1: 200 OK
Client2 -> Server: PUT /api/resource\nIf-Match: "1"
note left of Client2 : Client2 versucht die Ressource zu verändern, der Server lehnt\njedoch die Aktualisierung ab, da die Version der Ressource\nnicht mehr aktuell ist.
Server -> Client2: 412 Precondition Failed
@enduml
```
