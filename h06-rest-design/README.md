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

| Methode | Idempotent | Begründung                                                                                                                                                                                                |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST    |            | `POST` Anfragen dürfen auch andere Auswirkungen haben als lediglich eine Ressource zu erstellen. Diese _side-effects_ können sich jederzeit verändern.                                                    |
| PUT     | x          | Die derzeitige Ressource wird vollständig ersetzt. Nach der Überschreibung liegt jedes Mal die gleiche Ressource vor, sofern die Anfrage gleich geblieben ist.                                            |
| PATCH   |            | Je nachdem, _wie_ die Änderung formuliert ist, kann Idempotenz vorliegen. Wenn die PATCH-Anfrage `{ "change": "stock", "add": -1 }` vorliegt, würde jede weitere Anfrage die Stückzahl weiter verringern. |

> Beantworten Sie klar, wie die jeweiligen Methoden eine mögliche _resource creation_ prozessieren.
> Klären Sie diese Aspekte möglichst unter der Berücksichtigung konkreter Beispiele und deren Status-Antwortcodes.

#### POST

Nach einer erfolgreichen Anlage _sollte_ die Response den Status-Code `201 CREATED` liefern. Weiters sollte auch ein `Location`-Header vorhanden sein, der auf die gerade erstellte Ressource verweist.
Sollte die Ressource nicht durch eine URL identifizierbar sein, sind auch entweder Status `200 OK` oder `204 NO CONTENT` angemessen.

##### Beispiel 1 - `201 CREATED`

```http
POST https://example.com/users HTTP/1.1

{
    "name": "John",
    "dob": "2000-01-01T080808Z
}
```

```http
HTTP/1.1 201 CREATED
Location: /users/2
```

##### Beispiel 2 - `204 NO CONTENT`

```http
POST https://example.com/users HTTP/1.1

{
    "name": "John",
    "dob": "2000-01-01T080808Z
}
```

```http
HTTP/1.1 204 NO CONTENT
```

_Notiz: `NO CONTENT` wird retourniert, aber die Ressource wurde trotzdem erfolgreich erstellt. Das kann sein, wenn die Ressource zwar zu einer Collection hinzugefügt wird, aber keine eigenständige ID bekommt._

#### PUT

Wurde durch ein `PUT` eine neue Ressource erstellt, _muss_ der Status-Code `201 CREATED` retourniert werden.
Wenn eine bestehende Ressource verändert wurde, kann entweder `200 OK` oder `204 NO CONTENT` verwendet werden.

```http
PUT https://example.com/users/2 HTTP/1.1

{
    "name": "John",
    "dob": "2000-01-01T080808Z
}
```

```http
HTTP/1.1 200 OK
```

#### PATCH

Durch ein `PATCH` können ausschließlich bereits bestehende Ressourcen verändert werden.  
Für JSON-Daten kann hier das [_JSON Patch_](https://jsonpatch.com/) Format verwendet werden, welches die Änderungen in einem Array speichert.

Bestehende Daten:

```json
{
   "2": {
       "name": "John",
       "dob": "2000-01-01T080808Z,
       "social_credit": 800
   }
}
```

```http
PATCH https://example.com/users/2 HTTP/1.1

[
    {
        "op": "add",
        "path": "/social_credit",
        "value": -200
    }
]

```

```http
HTTP/1.1 200 OK
```

### 2.5 Benennung von Ressourcen

> Nennen Sie jeweils drei grundsätzliche _Do's_ und _Dont's_ für die Benennung von Ressourcen (Design der URL). Geben Sie bei jedem Punkt auch ein konkretes Beispiel an.

#### Do's

-   Klare und verständliche Benennung
    `/users` statt `/u`
-   Verwendung von Sub-Ressourcen
    `/users/124151/emails`

-   Verwendung von Singular statt Plural
    `/user/124151`

#### Dont's

-   Verwendung von Verben
    `/createUser` statt `/users`
-   Verwendung von Großbuchstaben
    `/Users` statt `/users`
-   Falsche Verwendung von HTTP-Methoden
    `GET /users/124151/delete` statt `DELETE /users/124151`

### 2.6 REST Prinzipien

> Benennen und erklären Sie vier Prinzipien, die ein REST-Interface klassischerweise verfolgt.

-   **Addressierbarkeit**
    Jede Ressource muss über eine eindeutige URL erreichbar sein.
-   **Zustandslosigkeit**
    Jede Anfrage muss alle Informationen enthalten, die für die Verarbeitung notwendig sind.
-   **Entkopplung**
    Server und Client sind voneinander unabhängig und können sich unabhängig voneinander weiterentwickeln. Darstellungen und Daten sind getrennt.
-   **Uniform Interface**
    Auf REST wird immer über einen einheitlichen Satz von Operationen zugegriffen. Dieser Satz ist unabhängig von der Ressource und wird durch die HTTP-Methoden definiert.

### 2.7 Richardson Maturity Model

> Erklären Sie im RMM Level 0 bis 2. Klären Sie darüber hinaus, welcher Zweck mit Level 3 verfolgt wird.

-   **Level 0 - The Swamp of POX**
    HTTP wird eigentlich nur als Transportprotokoll verwendet, ohne die spezifischen Methoden zu nutzen. Alle Anfragen werden über `POST` gesendet.
-   **Level 1 - Resources**
    Es werden Ressourcen definiert und über die URL angesprochen. Die HTTP-Methoden werden jedoch noch nicht verwendet.
-   **Level 2 - HTTP Verbs**
    Die HTTP-Methoden werden verwendet, um die CRUD-Operationen zu definieren.
-   **Level 3 - Hypermedia Controls**
    Die API enthält neben den Daten auch Links zu anderen Ressourcen. (`HATEOAS` - Hypermedia as the engine of application state) Dadurch wird die API selbstbeschreibend und der Client kann sich selbstständig durch die API navigieren.
    Durch die Verwendung von Hypermedia wird die API flexibler und Clients können sich dynamisch an Änderungen anpassen.
