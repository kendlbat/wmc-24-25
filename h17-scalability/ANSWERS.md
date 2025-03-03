# 12 Factor Apps

## Skalierbarkeit

> Welche Unterschiede bestehen zwischen einer vertikalen bzw. horizontalen Skalierbarkeit? Beschreiben Sie den Unterschied anhand des zur Verfügung gestellten Backends.

Vertikale Skalierbarkeit beschreibt die Möglichkeit, dem bestehenden System mehr Ressourcen zur Verfügung zu stellen. Diese Skaliermöglichkeit ist jedoch begrenzt, da die Hardware des Systems nicht unendlich erweiterbar ist (auch Preislich).

Horizontale Skalierbarkeit beschreibt die Möglichkeit, das System durch Hinzufügen von weiteren Instanzen zu skalieren. Dies ist in der Regel einfacher und günstiger als die vertikale Skalierung, dafür muss jedoch die Applikation einige Anforderungen (siehe 12-Factor Apps) erfüllen.

## Zustandslosigkeit

> Ein Requirement lautet _12-Factor processes are stateless_. Was bedeutet dies und warum ist dies wichtig für die Skalierbarkeit? Beschreiben Sie ein Szenario im Kontext Ihrer SYP Applikation, die gegen dieses Requirement verstoßen würden. Welche Auswirkung hätte dies?

Ein stateless Prozess speichert keine Daten zwischen den einzelnen Anfragen. Dies bedeutet, dass jede Anfrage unabhängig von den vorherigen Anfragen ist. (siehe HTTP)

Im Kontext der SYP-Applikation wäre ein Image Upload, der die Bilder nicht in die Datenbank lädt, sondern in einem Verzeichnis am Server ablegt ein Verstoß gegen das Requirement. Bei der Verwendung eines Load Balancers ist das Bild manchmal abrufbar und manchmal nicht, was den Fehler schwer reproduzierbar macht.

## Graceful Shutdown

> Was versteht man unter einem Graceful Shutdown? Wie kann z.B. ein Serverprozess darüber informiert werden, dass sich dieser beenden soll? Erklären Sie in eigenen Worten, welche Schritte im Rahmen eines Graceful Shutdown gemacht werden sollten.

Ein Graceful Shutdown ist ein Prozess, bei dem ein Serverprozess die Möglichkeit hat, alle offenen Verbindungen zu schließen und alle laufenden Prozesse zu beenden, bevor er sich selbst beendet. Dies ist wichtig, um sicherzustellen, dass keine Daten verloren gehen und keine Verbindungen unerwartet getrennt werden.

Ein Serverprozess kann z.B. über ein Signal (z.B. SIGTERM) informiert werden, dass er sich beenden soll. Der Serverprozess sollte dann alle offenen Verbindungen schließen und alle laufenden Prozesse beenden, bevor er sich selbst beendet.
