# Lost Update Problem

Das _Lost Update_ Problem tritt auf, wenn zwei Clients gleichzeitig auf eine Ressource zugreifen und diese verändern. Dabei wird die Änderung des einen Clients durch die des anderen Clients überschrieben, sodass die Änderung des ersten Clients verloren geht.

```plantuml
@startuml
participant Client1
participant Server
participant Client2

Client1 -> Server: GET /api/resource
Server -> Client1: 200 OK
Client2 -> Server: GET /api/resource
Server -> Client2: 200 OK
Client1 -> Server: PUT /api/resource
note right of Client1 : Client1 verändert die Ressource,\nClient2 bekommt diese Änderung jedoch nicht mit.
Server -> Client1: 200 OK
Client2 -> Server: PUT /api/resource
note left of Client2 : Client2 verändert die Ressource,\nüberschreibt jedoch die Änderung von Client1.\nLost Update!
Server -> Client2: 200 OK

@enduml
```
