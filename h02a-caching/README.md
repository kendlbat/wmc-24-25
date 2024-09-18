# HTTP Basics & Caching

## Task 1 - Enable / Disable Browsercaching

Kopieren und vereinfachen Sie das Car-Service aus Übungsblatt 1, die GET-Endpunkte sind für diese Übung ausreichend.

**Wichtig: generieren Sie individuelle Testdaten!!**

Express generiert standardmäßig einen _ETag_ Header und überprüft auch den _If-None-Match_ Header automatisch.
Führen Sie der Anwendung nun folgende Überprüfungen durch:

### E-Tag-Generierung und If-None-Match-Verarbeitung durch Express

-   Zeigen Sie dies in einem Sequenz-Diagramm (Plantuml) indem Sie einen GET-Request auf die Route `/api/cars` mit einem Rest-Client durchführen. Deaktivieren Sie den Cache über den _Cache-Control_ Header.
-   Integrieren Sie in das Sequenzdiagramm die HTTP-Messages (Request und Response) und dabei, und stellen Sie die cache-relevanten HTTP-Header dar.
-   Führen Sie den Vorgang erneut mit dem _If-None-Match_ Header und dem ETag-Wert durch. Erstellen Sie auch für diese Variante ein Sequenzdiagramm.
-   Vergleichen Sie die Größe des Responses.
-   Was passiert, wenn Sie mit `app.set('etag', false);` die Generierung des ETag auf Express-Seite verhindern.
    -   Antwort: Der ETag wird nicht mehr generiert, auch wenn der Client mit `If-None-Match`-Header anfragt, kommt trotzdem die volle `200`er-Response
