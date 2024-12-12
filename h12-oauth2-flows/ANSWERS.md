# ANSWERS

## Client Types

> Erklären Sie den Unterschied zwischen einem public und einem confidential Client im Kontext von OAuth2.
> Nennen Sie Beispiele für die beiden unterschiedlichen Typen von Clients.

Ein public Client kann nichts geheim halten, da er bspw. in einem Browser läuft und alle Daten vom Benutzer eingesehen werden können. Ein Beispiel für einen public Client ist eine Single Page Application (SPA).

Ein confidential Client hingegen kann ein Client Secret speichern und verwenden. Ein Beispiel für einen confidential Client ist ein Backend-Service.

## Device Code Flow

> Verwenden Sie die zur Verfügung gestellte Datei device-code.rest, um mittels eines Device Code Flows einen gültigen Access Token zu erlangen.
> Beantworten Sie folgende Detailfragen:
>
> -   Für welche Art von Clients wird der Device Code Flow eingesetzt?

Der Device Code Flow wird für Clients eingesetzt, die keinen Webbrowser zur Verfügung haben, um den Authorization Code Flow zu verwenden. z.B.: Smart TVs, CLI Applikationen

> -   Für welches Audience wird der Token erstellt?

`4769ca77-a9e9-45e2-b52c-e66f89f898cd` - Also die client id

> -   Wozu dient der Scope offline im Request?

Um ein Refresh Token zu erhalten mit dem der Access Token erneuert werden kann.

## Client Credentials Flow

> Verwenden Sie die zur Verfügung gestellte Datei client-credentials.rest, um mit Hilfe des Client Credentials Flow einen gültigen Access Token zu erlangen.
> Beantworten Sie folgende Detailfragen:
>
> -   Für welche Art von Clients wird dieser Flow eingesetzt?

Dieser Flow wird verwendet, wenn sich nicht der Nutzer, aber der Service Authentifizieren muss. z.B.: Microservices oder Backend bei Graph API

> -   Für welches Audience wird der Token erstellt?

`4769ca77-a9e9-45e2-b52c-e66f89f898cd`

## Resource Owner Password Credentials Flow

> Verwenden Sie die zur Verfügung gestellte Datei resource-owner-password.rest, um einen Access Token zu erlangen. Verwenden Sie dafür temporär ihren Schüleraccount bzw. das dazugehörige Password. Speichern Sie diese Zugangsdaten jedoch nicht in einer Datei bzw. im Git Repository.
>
> -   Dekodieren Sie den Access Token und bestimmen Sie, für welches Subject der Token ausgestellt wurde.

Der Token wurde für ein Subject ausgestellt das mit xGT beginnt. Bin mir nicht sicher ob es klug ist das hier rein zu tun also ist es nicht hier. `sub` ist ein User Identifier.

> -   Warum wird die Verwendung des ROPC Flow i.A. nicht mehr empfohlen?

Es gibt sicherere und bessere Alternativen. Außerdem wird beim ROPC flow das Passwort direkt an die Applikation übergeben, die es dann auch speichern könnte. MFA geht auch nicht.
