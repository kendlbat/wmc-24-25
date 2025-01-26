# Bergbroker

Gegeben ist eine _sehr sichere_ Web-Applikation. Führen Sie ein Security-Audit durch und finden Sie heraus, welche potentiellen Schwachstellen in dieser Applikation zu finden sind. Beschreiben Sie ihre Erkenntnisse in `FLAWS.md` und reparieren Sie die Schwachstellen.

Sie können einige Features der Applikation mittels der sample-requests in dem ordner `requests` testen.

Es gibt leichter und schwerer zu findende Schwachstellen.
Finden Sie so viele Schwachstellen wie möglich, es müssen nicht zwingend alle gefunden werden.

Diese Applikation kann wie folgt ausgeführt werden:

```bash
docker build -t bergbroker .
docker run -p 8080:8080 bergbroker
```

oder

```bash
npm install
cd client
npm install
npm run build
cd ..
npm start
```

oder

```bash
npm install
cd client
npm install

# Entweder UNIX & oder anderes Terminal
npm run dev &
cd ..
npm run dev
```
