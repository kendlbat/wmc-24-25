# ProgressBar

Implementieren Sie die Funktionen `runMacroTask`, `runMicroTask` und `runRequestAnimationFrame`, sodass der Fortschrittsbalken korrekt von 0% auf 100% innerhalb der angegebenen Dauer animiert wird.

## Vorlage runBlocking()

Blockiert die Event Loop vollständig, sodass das UI während der gesamten Berechnung nicht aktualisiert wird.
Dies dient als Referenz für eine nicht-optimierte Implementierung.

## runMacroTask()

Verwenden Sie die APIs `setTimeout` oder `setInterval`, um den Fortschrittsbalken schrittweise zu aktualisieren.
Achten Sie darauf, dass das UI reaktionsfähig bleiben muss.

## runMicroTask()

Verwenden Sie `queueMicrotask()` oder `Promise.resolve().then(...)`, um den Fortschritt zu aktualisieren.
Beobachten, Sie ob dies zu unerwarteten Effekten führt (z. B. Blockieren der UI). Erklären Sie das Verhalten in eigenen Worten im Programm-Code.

## runRequestAnimationFrame()

Verwenden Sie `requestAnimationFrame()`, um eine vernünftige Animation des Fortschrittsbalkens zu gewährleisten.
Eine entsprechende Vorlage finden Sie hier: <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>.

## webWorker

Verwenden Sie die WebWorker API des Browsers, um die Zeitdauer in einem zweiten Thread abzuwarten. Über entsprechende Nachrichten
soll der Fortschrittsbalken aktualisiert werden.
