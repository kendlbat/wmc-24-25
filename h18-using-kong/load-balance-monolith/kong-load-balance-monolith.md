# Load Balancing

Installieren Sie Kong unter Verwendung von Docker und der PostgreSQL Datenbank.
Vergewissern Sie sich, dass Sie die Anleitung für Open Source Variante (OSS) verwenden.

Konfigurieren Sie das Kong API Gateway dahingehend, dass Sie das Online-Shop-Backend (d.h. die
monolithische Implementierung) _load balancen_.

Vorbereitungen:

*   Starten Sie eine Instanz des MongoDB Container Images. Starten den Container so, dass dieser das durch Kong angelegte virtuelle Netzwerk `kong-net`
  verwendet. Verwenden Sie für den Container den Namen `shop-db-lb`.
*   Füllen Sie die Datenbank mit den entsprechenden Demodaten.  
*   Starten Sie zwei Instanzen des Container Images des Backends und vergeben Sie den Containern die Namen `shop-be-1` bzw.
  `shop-be-2`. Auch diese Container sollten das Netzwerk `kong-net` verwenden.

Folgen Sie dem Tutorial zum Thema Load Balancing <https://docs.konghq.com/gateway/3.9.x/get-started/load-balancing/>.
Dadurch, dass Ihre Container am selben Netzwerk wie Kong laufen, können Sie die Namen der Container
für die Konfiguration der _upstream targets_ verwenden.

Testen Sie Ihre Konfiguration, indem Sie laufend Requests auf `http://127.0.0.1:8000/api/products` absetzen. Über den Response Header `X-Node-Id`
sollten Sie beobachten können, von welcher der beiden Instanzen der Request beantwortet wurde. Testen Sie das Verhalten, wenn Sie
die jeweiligen Container stoppen bzw. wieder starten.

Dokumentieren Sie die notwendigen Kommandos bzw. die HTTP Requests zur Konfiguration von Kong in der Datei `load-balance-monolith.md`,
sodass Sie die Schritte im Unterricht nachvollziehbar präsentieren können.
