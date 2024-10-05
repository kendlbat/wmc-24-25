# Answers

## 2.1 HTTP Polling - Motivation

> Welches grundlegende Problem in der HTTP Kommunikation versucht man mit HTTP Polling zu umgehen?

Nur der Client kann Anfragen stellen, der Server kann nur auf eine bestehende Anfrage antworten.
Dies stellt ein Problem dar, wenn Kommunikation in Echtzeit (z.B. bei Spielen, Chat-Apps) erreicht werden soll.
Beim Polling stellt der Client kontinuierlich Anfragen, damit der durchgehende Datenaustausch von der Server-seite aus ermöglicht wird.

## 2.2 HTTP Short Polling

> Erklären Sie anhand eines Sequenzdiagramms wie man _short polling_ anwenden kann, um eine UI mit einem Dashboard für Sensordaten in Echtzeit zu aktualisieren.

```plantuml
participant Achim << Browser >>
participant Server
participant MQTT << Broker >>
participant "Sensor 1" << Sensor >>

activate "Sensor 1"
activate Server
activate MQTT
note right: Server subscribes to sensor topics
Server -> MQTT: subscribe\nhome/12345678/sensors/#
MQTT -> Server: broadcast\nhome/12345678/sensors/1\n23
note right: the broker sends\nthe last known message
deactivate Server

activate Achim
Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 23 }, ...]
deactivate Server
|||

Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state again, some delay
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 23 }, ...]
deactivate Server
|||

Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state again, some delay
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 23 }, ...]
deactivate Server

"Sensor 1" -> MQTT: publish\nhome/12345678/sensors/1\n21
MQTT -> Server: broadcast\nhome/12345678/sensors/1\n21
note right: at some time,\na new data is published

Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state again, some delay
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 21 }, ...]
note left: now the response\ncontains new data
deactivate Server
|||

Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state again, some delay
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 21 }, ...]
deactivate Server

```

> Welche Vor- und Nachteile hat _short polling_?

Vorteile

-   Sehr einfach zu implementieren
-   Funktioniert auch auf _sehr_ alten clients

Nachteile

-   _Sehr_ ineffizient
-   Updates können etwas Verspätung haben

## 2.3 HTTP Long Polling

> Erklären Sie anhand eines Sequenzdiagramms wie der Ansatz des _long polling_ funktioniert.

```plantuml
participant Achim << Browser >>
participant Server
participant MQTT << Broker >>
participant "Sensor 1" << Sensor >>

activate "Sensor 1"
activate Server
activate MQTT
note right: Server subscribes to sensor topics
Server -> MQTT: subscribe\nhome/12345678/sensors/#
MQTT -> Server: broadcast\nhome/12345678/sensors/1\n23
note right: the broker sends\nthe last known message
deactivate Server

activate Achim
Achim -> Server : GET /api/home/12345678/sensors
note left: fetch sensor state initially
activate Server
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 23 }, ...]
deactivate Server
|||

Achim -> Server : GET /api/home/12345678/sensors
note left: open new request for sensor state
activate Server

"Sensor 1" -> MQTT: publish\nhome/12345678/sensors/1\n21
MQTT -> Server: broadcast\nhome/12345678/sensors/1\n21
note right: at some time,\na new data is published
Server -> Achim: 200 OK\n[{ "id": 1, "temp": 21 }, ...]
note left: the server responds\nonce it recieves new data
deactivate Server
|||

Achim -> Server : GET /api/home/12345678/sensors
note left: open new request for sensor state
activate Server

```

> Stellen Sie diesen Ansatz dem _short polling_ gegenüber.
> Welche Vor- bzw. Nachteile ergeben sich?

Vorteile:

-   Keine "verschwendeten" Request-Response-Cycles

Nachteile:

-   Bei seltenen Updates können Request-Timeouts auftreten, neue Requests müssen gesendet werden
-   Server weiß nicht, ob der Client noch da ist, sendet trotzdem Response
