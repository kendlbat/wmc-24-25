# Containerisierung

Erstellen Sie für das gegebene Backend ein `Dockerfile`, um die gesamte Applikation in ein
Container Image zu verpacken. Verwenden Sie für das Image den Tag `shop-backend:v0`.

Bringen Sie das Image zur Ausführung und testen Sie das Backend mit den zur Verfügung gestellten `.rest` Dateien.

Versuchen Sie, den Container mit `docker stop ...` zu stoppen. Was kann dabei beobachtet werden?

## Graceful Shutdown

Verwenden Sie die Library `@godaddy/terminus`, um für das Backend ein _graceful shutdown_ umzusetzen.
Dabei sollte auf die beiden Signale `SIGTERM` bzw. `SIGINT` reagiert werden und das Backend heruntergefahren werden.
Als Timeout sollten 5 Sekunden gewählt werden.

Erstellen Sie basierend auf der erweiterten Implementierung wiederum ein Container Image, diesmal mit dem Tag `shop-backend:v1`,
und untersuchen Sie das Verhalten bei der Ausführung von `docker stop` erneut.

## Health Check

Erweitern Sie die Implementierung um einen Health Check unter Verwendung der `@godaddy/terminus` Library.
Der Health Check sollte unter `/health` erreichbar sein und den Status Code 200 zurückliefern,
sofern die Datenbankverbindung aufrecht ist bzw. den Status Code 500, wenn es Probleme mit der Datenbankverbindung gibt.
Entsprechende Beispiele, wie ein solcher Health Check umgesetzt werden kann, finden Sie im _github_ Repository
der Library.

Bauen Sie mit der neuen Implementierung ein weiteres Image mit dem Tag `shop-backend:v2` und testen Sie den Endpunkt
mittels HTTP Anfragen. Stoppen und Starten Sie den Container mit der MongoDB, um einen entsprechenden Ausfall
der Datenbankverbindung zu emulieren.
