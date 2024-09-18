# HTTP Protocol

## Aufgabenstellung

1. Erstellen Sie eine Server-Implementierung mit node.

    - Der Server soll auf eingehende Socket-Verbindungen _hören_ bzw. _warten_.

2. Empfangen Sie Daten vom Client über diese Socket-Verbindung.

    - Der Server soll die vom Client gesendeten Daten lesen und in die Console loggen.

3. Generieren Sie eine (statische) HTTP-Antwort.

    - Die Antwort soll direkt in den Stream geschrieben werden.

4. Schließen Sie die Verbindung.

    - Nachdem die Antwort gesendet wurde, soll die Verbindung zum Client sauber geschlossen werden.

## Anforderungen

-   Verwenden Sie node v22
-   Verwenden Sie `import` anstelle von `require`
-   Verwenden Sie nur node und die nativen Module (`net`-Modul), das `http`-Module darf NICHT verwendet werden.
-   Loggen Sie alle Ereignisse mit Timestamp in die Console (Verbindungsaufbau, Datenempfang, etc. )
-   Achten Sie darauf, die Header korrekt zu formatieren, einschließlich der Zeilenumbrüche.
-   Die `Content-Length` muss mit der tatsächlichen Länge des Inhalts übereinstimmen.

## Tests

```http
GET http://localhost:8080/something HTTP/1.1
```

### Expected outcome

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 13

Handmade HTTP Answer
```
