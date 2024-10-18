# h06-rest-design

Tobias Kendlbacher

## R.E.S.T API Design and Best Practices

### 1.1 Topics

Im Jahr 2000 schlug Roy Fielding Representational State Transfer (REST) als einen architektonischen Ansatz zur Gestaltung von Webdiensten vor.
REST ist ein Architekturstil für den Aufbau verteilter Systeme auf der Grundlage von Hypermedia.
REST ist unabhängig von jedem zugrunde liegenden Protokoll und nicht unbedingt an HTTP gebunden.
Die meisten gängigen REST-API-Implementierungen verwenden jedoch HTTP als Anwendungsprotokoll.

Quelle: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design

#### 1.1.1 Begrifflichkeiten - Wiederholung und Vertiefung

-   CRUD und Bedeutung der HTTP Methoden
    -   Begrifflichkeiten: Idempotent, Safe, Cacheable
-   Resourcetypes: Listresource vs. Mainresource vs. Subresource
-   Unterschied Query und Path Parameter
-   POST vs. PUT vs. PATCH in REST APIs

#### 1.1.2 Modellierung

-   Design Guidelines and Best Practices

### 1.2 Reading Tasks

Lesen Sie folgende Abschnitte in der Facharbeit `Facharbeit - Musterlösungen und Best Practices für das Design und die Realisierung von REST Schnittstellen.pdf`.

-   Kapitel: 3.1.3 Ressourcen
-   Kapitel: 3.1.4 Operationen
-   Kapitel: 3.2 Prinzipien
-   Kapitel: 3.4 Richardson Maturity Model (ergänzend folgende Quelle: https://martinfowler.com/articles/richardsonMaturityModel.html)
-   Kapitel: 4.2 Benennung von Ressourcen
-   https://apidog.com/blog/path-param-vs-query-param/

### 1.3 Originalarbeit von Roy Fielding

Für Interessierte:

-   https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

## 2 Questions

### 2.1 Resource Types

> Was ist eine Ressource?

Eine Ressource ist ein _Objekt_ mit:

-   einem Typ
-   zugehörigen Daten
-   Beziehungen zu anderen Ressourcen
-   Methoden, die darauf zugreifen

Sie ist ähnlich des Objekts im OOP, jedoch mit dem wichtigen Unterschied, dass ausschließlich die standardisierten HTTP Methoden (GET, POST, PUT, etc.) verwendet werden können.

Hilfreich: https://restful-api-design.readthedocs.io

> Erklären Sie die Unterschiede zwischen einer _Main-Resource_, _Sub-Resource_ und einer _List-Resource_ anhand eines konkreten Beispiels. Im Beispiel sollten die URL-Angaben für die jeweiligen Ressourcen ersichtlich sein.

Es gibt sogenannte _Singleton_-Ressourcen (Main), wie beispielsweise `/users/124151` und _Collection_-Ressourcen (List) wie `/customers`.
Zusätzlich können Ressourcen auch in Abhängigkeit zu hierarchisch höher-liegenden Ressourcen abrufbar sein, diese werden dann als _Sub_-Ressourcen bezeichnet. Beispiel: `/users/124151/emails` oder `/users/124151/chats/5151`.

### 2.2 Path Parameter

> Was sind _path parameter_ im Zusammenhang mit einer REST API? Erklären Sie mit Hilfe eines konkreten Beispiels.

Path-Parameter sind Variablen, welche einen direkten Teil des URL-Pfades darstellen.
Diese werden üblicherweise mit Doppelpunkt (`/users/:id`) oder geschwungenen Klammern (`/users/{id}`) markiert und stellen **unbedingt notwendige Parameter** dar.

In unserem Beispiel kann Nutzer `John Doe` mit der Id `124151` wie folgt abgerufen werden:

```http
GET https://example.com/users/124151 HTTP/1.1
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": 124151,
    "firstname": "John",
    "lastname": "Doe",
    "birthdate": "2001-01-01"
}
```

### 2.3 Query Parameter

> Was sind _query parameter_ im Zusammenhang mit einer REST API? Erklären Sie mit Hilfe eines konkreten Beispiels.

Query-Parameter werden optional nach einem `?` in dem URL übergeben. Sie bestehen aus _Key-Value_ Paaren, wobei Schlüssel und Wert durch ein `=` getrennt sind und Paare durch `&` voneinander unterschieden werden. Üblicherweise werden Query-Parameter für **optionale Parameter** verwendet, ohne welche die Anfrage trotzdem valide bleibt.
In unserem Beispiel könnten wir die Nutzer der Applikation nach ihrem Geburtsjahr filtern:

```http
GET https://example.com/users?birthyear=2001 HTTP/1.1
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "id": 124151,
        "firstname": "John",
        "lastname": "Doe",
        "birthdate": "2001-01-01"
    },
    {
        "id": 124152,
        "firstname": "Susi",
        "lastname": "Doe",
        "birthdate": "2001-02-28"
    }
]
```

### 2.4 POST vs. PUT vs. PATCH

> Erklären Sie die Unterschiede dieser HTTP-Methoden im Zusammenhang mit einer REST-API.

Die HTTP-Methoden `POST`, `PUT` und `PATCH` werden von unerfahrenen Programmierer:innen häufig als äquivalent angesehen und austauschbar verwendet.

Grundlegend stehen diese drei Methoden zusammen mit `GET` und `DELETE` für die verschiedenen _CRUD_-Operationen, welche aus der Datenbankentwicklung stammen.

-   `POST` - **C**reate
-   `GET` - **R**ead
-   `PUT` / `PATCH` - **U**pdate
-   `DELETE` - **D**elete

Der Unterschied zwischen `PUT` und `PATCH` besteht lediglich darin, dass bei `PUT` die gesamte Ressource _ersetzt_ wird, bei `PATCH` hingegen werden einzelne Attribute der Ressource neu gesetzt.

Quelle: https://stackoverflow.com/a/40711235

> Erklären Sie, welche der Methoden _idempotent_ sind und warum.

Idempotenz bedeutet, dass eine Operation mehrmals ausgeführt werden kann, ohne das Ergebnis über die initiale Auswirkung hinaus zu verändern.  
Jede Methode _kann_ idempotent sein, ob sie es auch sein _muss_ wird in [RFC2616](https://www.rfc-editor.org/rfc/rfc2616) festgelegt.

| Methode | Idempotent | Begründung                                                                                                                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST    |            | `POST` Anfragen dürfen auch andere Auswirkungen haben als lediglich eine Ressource zu erstellen. Diese _side-effects_ können sich jederzeit verändern.                                           |
| PUT     | x          | Die derzeitige Ressource wird vollständig ersetzt. Nach der Überschreibung liegt jedes Mal die gleiche Ressource vor, sofern die Anfrage gleich geblieben ist.                                   |
| PATCH   |            | Je nachdem, _wie_ die Änderung formuliert ist, kann Idempotenz vorliegen. Wenn die PATCH-Anfrage {change: 'Stock' add: -1} vorliegt, würde jede weitere Anfrage die Stückzahl weiter verringern. |

> Beantworten Sie klar, wie die jeweiligen Methoden eine mögliche _resource creation_ prozessieren.
> Klären Sie diese Aspekte möglichst unter der Berücksichtigung konkreter Beispiele und deren Status-Antwortcodes.

### 2.5 Benennung von Ressourcen

> Nennen Sie jeweils drei grundsätzliche _Do's_ und _Dont's_ für die Benennung von Ressourcen (Design der URL). Geben Sie bei jedem Punkt auch ein konkretes Beispiel an.

### 2.6 REST Prinzipien

> Benennen und erklären Sie vier Prinzipien, die ein REST-Interface klassischerweise verfolgt.

### 2.7 Richardson Maturity Model

> Erklären Sie im RMM Level 0 bis 2. Klären Sie darüber hinaus, welcher Zweck mit Level 3 verfolgt wird.
