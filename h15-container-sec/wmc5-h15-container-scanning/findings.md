# Findings

## Images bauen

`cd variantX; docker build -t tracking-app:variantX .`

## Container starten

`docker run -d -p 8080:8080 tracking-app:variantX`

## App-Analyse

Mit dieser Middleware wird ein Logger zugeschalten, der mit einem `tracking-id` Cookie einen Nutzer über mehrere Requests hinweg identifiziert.
This section describes container image specific compliance reports. For an overview of Trivy's Compliance feature, including working with custom compliance, check out the Compliance documentation.

## VariantA

Node 19 statt Node 22 - Update auf Node 22

## VariantB

Keine Schwachstellen gefunden

## VariantC

Alte Versionen von Libraries, updaten der libraries durch `npm update`

## VariantD

Private key in `server.pem`, darf nicht ausgeliefert werden im image, kann zu dockerignore hinzugefügt werden
