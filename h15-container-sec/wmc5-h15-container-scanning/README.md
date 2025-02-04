# Container Scanning

Gegeben sind mehrere Varianten einer Implementierung eines Express-basierten Services,
die sich in den Unterverzeichnissen `variantA` bis `variantD` befinden.

Dokumentieren Sie für die folgenden Schritte die verwendeten Befehle und die Resultate in einer
entsprechenden Datei `findings.md`.

## Images bauen

Bauen Sie die Images unter Verwendung des jeweiligen `Dockerfile` in den Unterverzeichnissen.
Die Tags der Images sollten der Konvention `tracking-app:variantX` folgen.

## Container ausführen

Versuchen Sie, die daraus resultierenden Images mit `docker run ...` zu starten und über einen Browser darauf zuzugreifen.

Analysieren Sie die Ausgabe auf der Konsole bzw. den Source Code der verwendeten
Express-Middleware. Beschreiben Sie in eigenen Worten, was man mit dieser Middleware bezwecken kann.

Hinweis: Zum Stoppen des Containers verwenden Sie am besten `docker stop CONTAINER_ID -t 3`.

## Container Image Scanning

Verwenden Sie das tool _trivy_, um die drei erzeugten Container Images zu scannen. Sie können dafür
entweder die Extension von Docker Desktop oder das Linux Kommandozeilentool verwenden.

*   Welche Probleme können mit dem Tool bei den einzelnen Varianten erkannt werden?
*   Welche Lösungsmöglichkeit schlagen Sie für die einzelnen Varianten vor?
