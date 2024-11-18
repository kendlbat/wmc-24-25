# Secure WebApp - Session Cookies

## Allgemeines

Gegeben ist das Gerüst einer Full-Stack-Webapplikation mit einem einfachen Express-Backend (`server.js`)
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

Im Falle einer erfolgreichen Authentifizierung muss im Backend eine Session erzeugt werden. D.h.
es muss eine _session id_ generiert werden und die Verknüpfung mit dem Benutzernamen im Objekt `SESSIONS` abgelegt werden. 
Die erzeugte _session id_ muss dann im Response als Cookie mitgegeben werden.

Weitere Informationen zu den Status Codes finden Sie als Kommentar in der Datei `server.js`.

Testen Sie Ihre Implementierung mit den bereitgestellten Requests in der Datei `requests/cookie-based.rest`.

## Lese- und Schreibzugriff - Autorisierung

In der Implementierung des Backends ist eine Ressource `/api/secure-resource` vorgegeben, die
sowohl `GET` als auch `POST` Requests zulässt. Erweitern Sie die Implementierung dahingehend,
dass über die im Cookie automatisch mitgegebene _session id_ der eingeloggte Benutzer bestimmt
wird. Überprüfen Sie, ob dieser Benutzer auch die notwendigen Berechtigung in Form einer korrekten
Rolle besitzt.

Testen Sie Ihre Implementierung mit den bereitgestellten Requests in der Datei `requests/cookie-based.rest` bzw. im Frontend.

## Logout

Realisieren Sie das Logout über einen `POST /auth/logout`. In dem Fall muss die aktuelle Session am Backend entfernt und auch das Cookie gelöscht werden.

Testen Sie Ihre Implementierung mit den bereitgestellten Requests in der Datei `requests/cookie-based.rest`.

## Sperren und Löschen von Benutzern

Über die den Endpunkt `/users` können Benutzer auch während des Betriebs gelöscht (`DELETE`) und auch verändert werden. So können mittels `PATCH` dem User Rollen hinzugefügt bzw. entzogen werden,
bzw. der Benutzer auch gesperrt oder entsperrt werden. Entsprechende Requests zum Testen finden
Sie in der Datei `requests/user-management.rest`.

Überlegen Sie, welche Auswirkung diese Operationen auf laufende Sessions haben können und ergänzen
Sie die Implementierung in den beiden Endpunkten entsprechend.
