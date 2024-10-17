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

> Was ist eine Ressource? Erklären Sie die Unterschiede zwischen einer _Main-Resource_, _Sub-Resource_ und einer _List-Resource_ anhand eines konkreten Beispiels. Im Beispiel sollten die URL-Angaben für die jeweiligen Ressourcen ersichtlich sein.

### 2.2 Path Parameter

> Was sind _path parameter_ im Zusammenhang mit einer REST API? Erklären Sie mit Hilfe eines konkreten Beispiels.

### 2.3 Query Parameter

> Was sind _query parameter_ im Zusammenhang mit einer REST API? Erklären Sie mit Hilfe eines konkreten Beispiels.

### 2.4 POST vs. PUT vs. PATCH

> Erklären Sie die Unterschiede dieser HTTP-Methoden im Zusammenhang mit einer REST-API.  
> Erklären Sie, welche der Methoden _idempotent_ sind und warum.
> Beantworten Sie klar, wie die jeweiligen Methoden eine mögliche _resource creation_ prozessieren.
> Klären Sie diese Aspekte möglichst unter der Berücksichtigung konkreter Beispiele und deren Status-Antwortcodes.

### 2.5 Benennung von Ressourcen

> Nennen Sie jeweils drei grundsätzliche _Do's_ und _Dont's_ für die Benennung von Ressourcen (Design der URL). Geben Sie bei jedem Punkt auch ein konkretes Beispiel an.

### 2.6 REST Prinzipien

> Benennen und erklären Sie vier Prinzipien, die ein REST-Interface klassischerweise verfolgt.

### 2.7 Richardson Maturity Model

> Erklären Sie im RMM Level 0 bis 2. Klären Sie darüber hinaus, welcher Zweck mit Level 3 verfolgt wird.
