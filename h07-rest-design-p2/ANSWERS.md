# REST API Design and Best Practices - Part 2

## 1 - REST Versionierung

> Sie müssen für eine REST-Schnittstelle ein Versionierungskonzept entwickeln. Der REST-Schnittstelle liegt das HTTP-Protokoll zugrunde. Welche technischen Möglichkeiten gibt es das Versionierungskonzept zu implementieren?

-   Versionierung über Header

    -   über Custom Header
        ```http
        GET /api/resource HTTP/1.1
        X-API-Version: 1
        ```
    -   über Vendor Content-Type
        ```http
        GET /api/resource HTTP/1.1
        Accept: application/vnd.company.resource.v1+json
        ```
    -   über Parametrischen Accept-Header
        ```http
        GET /api/resource HTTP/1.1
        Accept: application/json; version=1
        ```

-   Versionierung über URL

    -   Parameter
        ```http
        GET https//example.com/api/v1/resource HTTP/1.1
        ```
    -   Subdomain

        ```http
        GET https//v1.example.com/api/resource HTTP/1.1
        ```

## 2 - REST Effizienz

> Welche grundsätzlichen Möglichkeiten sind Ihnen bekannt, um die Effizienz einer REST-API zu steigern?
> Beschreiben Sie diese Möglichkeiten kurz und geben Sie auch jeweils Beispiele dazu an.

-   Partielle Antworten
    Durch die Möglichkeit, nur die benötigten Felder einer Ressource abzurufen, kann die Datenmenge reduziert werden. Dies kann durch Query-Parameter erreicht werden.
    ```http
    GET /api/resource?fields=name,age HTTP/1.1
    ```
-   Caching
    Durch das Caching von Ressourcen können Anfragen an den Server reduziert werden. Dies kann durch den `Cache-Control`-Header erreicht werden.
    ```http
    GET /api/resource HTTP/1.1
    Cache-Control: max-age=3600
    ```
-   Filterung
    Durch das Filtern von Ressourcen können unnötige Daten reduziert werden. Dies kann durch Query-Parameter erreicht werden.
    ```http
    GET /api/resource?filter=age>18 HTTP/1.1
    ```

## 3 - Lost Update und Optimistic Locking

> Zeigen Sie in einem PlantUML Sequence Diagramm wie das _lost update_ problem in einem verteilten System entsteht.
> Beschreiben Sie das Problem in eigenen Sätzen und schreiben Sie diese in die Datei `lost-update.md`. Integrieren Sie das PlantUML-Diagramm ebenfalls in das Markdown-File.

Siehe [lost-update.md](lost-update.md).

> Beschreiben Sie in eigenen Sätzen, was man unter _optimistic locking_ im Zusammenhang mit dem _lost update_ Problem versteht.
> Schreiben Sie Ihre Sätze in die Datei `optimistic-locking.md`.
> zeigen Sie den Ablauf in einem PlantUML Sequence Diagramm und integrieren Sie das Diagramm in das Markdown-File.

Siehe [optimistic-locking.md](optimistic-locking.md).

## 4 - JSON Patch

> Beschreiben Sie die grundsätzliche Idee des JSON Patch Formates. Gehen Sie dabei auf den Aufbau des JSON Patch Format ein und erörten Sie, in welchen Fällen dieses Format verwendet werden sollte?

## 5 - JSON Merge Patch vs. JSON Patch

> Beschreiben Sie den Unterschied zwischen den Formaten sowohl anhand des vorgegebenen und zusätzlich anhand eines selbst gewählten Beispiels.
> JSON-Object (vorgegebenes Beispiel):
>
> ```json
> {
>     "firstname": "Henry",
>     "lastname": "V.I.I.I.",
>     "hobbies": ["Hunting", "Playing chess", "Beheading women"]
> }
> ```
>
> Aufgaben:
>
> -   Ändern Sie den Nachnamen auf “Henry VIII”
> -   Entfernen Sie den Vornamen
> -   Fügen Sie das Geburtsdatum hinzu
> -   Entfernen Sie das 3. Hobby
> -   Fügen Sie ein neues Hobby Ihrer Wahl hinzu
>
> Überprüfen Sie Ihre Lösung mit einem Online-Editor wie https://jsonpatch.me/
> Ihr selbst gewähltes Beispiel sollte eine ähnliche Komplexität aufweisen.

## 6 - Generierung von Ressourcen-IDs

> -   Welche (zwei) Arten von Schlüsseln können als Ids für Ressourcen in REST verwendet werden?
> -   Welche der beiden Schlüsselarten kann am Server, welche am Client generiert werden?
> -   Welche Probleme können bei der jeweiligen Variante entstehen und wie kann man diese lösen bzw. mildern?
> -   Wenn die Id am Client generiert wird, mit welcher HTTP Methode sollte die Ressource folglich erzeugt werden?
> -   Wenn die Id am Server generiert wird, mit welcher HTTP Methode sollte die Ressource folglich erzeugt werden?
