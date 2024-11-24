# Secure WebApp - JWT

## Allgemeines

Gegeben ist das Gerüst einer Full-Stack-Webapplikation mit einem einfachen Express-Backend (`server-jwt.js`)
und einem Frontend basierend auf einer einfachen HTML Page (`client/index.html`).
Aus Gründen der Einfachheit werden im Backend alle Daten im Hauptspeicher gespeichert (_in-memory_).

Ebenfalls sind alle Benutzer in einem globalen Array `USERS` gespeichert inkl. der Rollen,
dem Passwort und der Information, ob der Benutzer gesperrt ist oder nicht. Beachten Sie, dass
in einer realen Implementierung **niemals** das Password im Plain-Text am Backend gespeichert
werden darf.

## Login - Authentifizierung

Implementieren Sie den Endpunkt `POST /auth/login`. Dieser erhält Benutzernamen und Passwort
als JSON Objekt und muss überprüfen, ob es einen entsprechenden Benutzer gibt, das Passwort
übereinstimmt und der Benutzer nicht gesperrt ist.

Im Falle einer erfolgreichen Authentifizierung muss im Backend ein Access Token in Form eines JWT
erzeugt werden. Der Token muss im Response Body als JSON Objekt mit dem Property `access_token`
zurückgeliefert werden.

Erzeugen Sie den Access Token mit Hilfe der Library `jsonwebtoken` und folgenden Vorgaben:

* Der Token muss für 3 Minuten gültig sein.
* Der Username muss im Claim `sub` codiert werden.
* Der Token sollte eine UUID im Claim `jti` beinhalten.
* Die Rollen müssen im Claim `roles` angegeben werden.
* Als _Issuer_ als auch als _Audience_ wird der String `secure-app` verwendet.
* Verwenden Sie den HS256 Algorithmus in Kombination mit dem Schlüssel `JWT_SECRET`.

Weitere Informationen zu den Status Codes finden Sie als Kommentar in der Datei `server-jwt.js`.
Testen Sie Ihre Implementierung mit den bereitgestellten Requests in der Datei `requests/jwt-based.rest`.

## Lese- und Schreibzugriff - Autorisierung

In der Implementierung des Backends ist eine Ressource `/api/secure-resource` vorgegeben, die
sowohl `GET` als auch `POST` Requests zulässt. Erweitern Sie die Implementierung dahingehend,
dass zunächst der im Authorization-Header übertragene Token validiert wird. Verwenden Sie
dafür `jsonwebtoken.verify(...)`.

Der Zugriff auf die Ressource darf nur erfolgen, wenn der Token eine gültige Signatur beinhaltet,
die Audience korrekt ist, der Token nicht abgelaufen ist und auch die korrekten Rollen
enthalten sind.

Testen Sie Ihre Implementierung mit den bereitgestellten Requests in der Datei `requests/jwt-based.rest`.

## Integration im Frontend

Erweitern Sie die Implementierung im Frontend dahingehend, dass der beim Login erhaltene Token
in einer lokalen Variable gespeichert wird. Bei allen weiteren Requests muss der Token in Form
eines _Bearer_ Tokens im Authorization-Header mitgegeben werden.

## Logout

Überlegen Sie, welche Schritte beim Logout notwendig sind und setzen Sie diese im Frontend bzw. Backend um.

## Sperren und Löschen von Benutzern

Über die den Endpunkt `/users` können Benutzer auch während des Betriebs gelöscht (`DELETE`) und auch verändert werden. So können mittels `PATCH` dem User Rollen hinzugefügt bzw. entzogen werden,
bzw. der Benutzer auch gesperrt oder entsperrt werden. Entsprechende Requests zum Testen finden
Sie in der Datei `requests/user-management.rest`.

Überlegen Sie, welche Auswirkung diese Operationen auf ausgestellte Tokens haben können, und ergänzen
Sie die Implementierung in den beiden Endpunkten entsprechend.
