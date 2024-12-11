# Monitoring System

## Ausgangslage

Gegeben ist eine einfache Monitoringlösung bestehend aus einem Client und einem Server.
Der Client ist in der Datei `client.js` implementiert und misst alle 5 Sekunden die Systemlast
und den Speicherverbrauch und sendet diese Messwerte per HTTP an den Server.

Der Server ist ein einfaches, auf Express-basierendes Service, welches die Monitoringdaten
über den Endpunkt `/api/metrics` entgegennimmt und in der derzeitigen Implementierung in der `server.js`
einfach ausgibt.

Die Aufgabenstellung ist es nun, die Autorisierung unter Verwendung von OAuth2 und dem
_client credential flow_ umzusetzen.

## Erweiterung Client

Erweitern Sie den Client dahingehend, dass dieser unter Verwendung der Microsoft Authentication Library (MSAL)
einen Access Token bezieht. Für den _client credential flow_ werden folgende Informationen benötigt. Diese sollten
über Umgebungsvariablen konfiguriert werden können.

```text
TENANT_ID     : 2b197efa-8e1b-4680-b263-8e237889b5b3
CLIENT_ID     : de6c67e6-9523-4601-8a6c-359a171852ed
CLIENT_SECRET : 8Zl8Q~.Xn7bfQ_wUfj3ybIdAU3DSsXkd0JkDUb7G
```

Halten Sie sich bei der Umsetzung an die entsprechende [Dokumentation der MSAL Library](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/request.md)

Sobald Sie den Token erhalten haben, senden Sie diesen als Bearer Token in jedem HTTP Request an den Server mit.
Die Tatsache, dass man diesen nicht über eine ungesicherte Verbindung senden sollte, kann in diesem Zusammenhang
vernachlässigt werden.

## Analyse Access Token

Loggen Sie den erhaltenen Access Token auf der Console mit und dekodieren Sie diesen mit einem geeignet Tool wie
https://jwt.io. Bestimmen Sie die verwendeten Claims und beantworten Sie folgende Fragen:

-   Für welches Subject wurde der Token ausgestellt?
    -   "164c1994-7319-4db9-84d5-4a1bbe457f85"
-   Wie viele Sekunden ist der Token gültig?
    -   3600
-   Wozu dient der Claim `tid`?
    -   Tenant ID
-   Welcher Signaturalgorithmus wurde verwendet?
    -   RSASHA256

Führen Sie diese Analyse mit 3 Tokens aus und vergleichen Sie, ob und inwiefern sich diese Werte ändern.

Wie in folgenden Patches zu sehen, ändern sich folgende Werte:

-   `iat` (Issued At)
-   `nbf` (Not Before)
-   `exp` (Expiration Time)
-   `aio` (Account Identifier Object - Microsoft intern)
-   `uti` (User Token Identifier)

```patch
--- t1.txt	2024-12-12 00:13:45.061110562 +0100
+++ t2.txt	2024-12-12 00:13:48.044471823 +0100
@@ -1,10 +1,10 @@
 {
   "aud": "de6c67e6-9523-4601-8a6c-359a171852ed",
   "iss": "https://sts.windows.net/2b197efa-8e1b-4680-b263-8e237889b5b3/",
-  "iat": 1733957950,
-  "nbf": 1733957950,
-  "exp": 1733961850,
-  "aio": "k2BgYJgvvj7ByP3Bns/rC6unmCfNAQA=",
+  "iat": 1733958410,
+  "nbf": 1733958410,
+  "exp": 1733962310,
+  "aio": "k2BgYEg7u2ca42Qv8Z8bL77gaONyAwA=",
   "appid": "de6c67e6-9523-4601-8a6c-359a171852ed",
   "appidacr": "1",
   "idp": "https://sts.windows.net/2b197efa-8e1b-4680-b263-8e237889b5b3/",
@@ -12,6 +12,6 @@
   "rh": "1.ARAA-n4ZKxuOgEayY44jeIm1s-ZnbN4jlQFGimw1mhcYUu2XAAAQAA.",
   "sub": "164c1994-7319-4db9-84d5-4a1bbe457f85",
   "tid": "2b197efa-8e1b-4680-b263-8e237889b5b3",
-  "uti": "2sfbjvpvjEGwtFKeiNM3AA",
+  "uti": "PyTUau3G5UujK0Rz-PFBAA",
   "ver": "1.0"
 }
```

```patch
--- t2.txt	2024-12-12 00:15:47.178974405 +0100
+++ t3.txt	2024-12-12 00:16:32.519444241 +0100
@@ -1,10 +1,10 @@
 {
   "aud": "de6c67e6-9523-4601-8a6c-359a171852ed",
   "iss": "https://sts.windows.net/2b197efa-8e1b-4680-b263-8e237889b5b3/",
-  "iat": 1733958410,
-  "nbf": 1733958410,
-  "exp": 1733962310,
-  "aio": "k2BgYEg7u2ca42Qv8Z8bL77gaONyAwA=",
+  "iat": 1733958674,
+  "nbf": 1733958674,
+  "exp": 1733962574,
+  "aio": "k2BgYFjZ3OobN9mhcvH7zGUrD/u7AwA=",
   "appid": "de6c67e6-9523-4601-8a6c-359a171852ed",
   "appidacr": "1",
   "idp": "https://sts.windows.net/2b197efa-8e1b-4680-b263-8e237889b5b3/",
@@ -12,6 +12,6 @@
   "rh": "1.ARAA-n4ZKxuOgEayY44jeIm1s-ZnbN4jlQFGimw1mhcYUu2XAAAQAA.",
   "sub": "164c1994-7319-4db9-84d5-4a1bbe457f85",
   "tid": "2b197efa-8e1b-4680-b263-8e237889b5b3",
-  "uti": "PyTUau3G5UujK0Rz-PFBAA",
+  "uti": "E-QDfCVI1EG2cURzVZNEAA",
   "ver": "1.0"
 }
```

## Manuelle Überprüfung der Signatur

Die von Microsoft ausgestellten Tokens sind mit einem asymmetrischen Signaturverfahren signiert welches ein
Schlüsselpaar verwendet, das aus einem privaten und einem öffentlichen Schlüssel besteht. Für das Signieren
wird ein privater Schlüssel verwendet, der nur dem Aussteller bekannt ist. Jeder andere kann jedoch die Signatur
mit einem öffentlichen Schlüssel überprüfen. Aus Sicherheitsgründen werden diese Schlüsselpaare regelmäßig gewechselt.

Die aktuellen öffentlichen Schlüssel sind unter folgender URL zu beziehen.

https://login.microsoftonline.com/2b197efa-8e1b-4680-b263-8e237889b5b3/discovery/v2.0/keys

Die Information, welcher der öffentlichen Schlüssel verwendet wurde, kann über das Feld `kid` im JWT Header
bestimmt werden. Bestimmen Sie den Schlüssel und zeigen Sie, wie die Signatur mit Hilfe des öffentlichen Schlüssels
geprüft werden kann.

![JWT Public Key](jwt-sig-check.png)

```json
{
    "kty": "RSA",
    "use": "sig",
    "kid": "zxeg2WONpTkwN5GmeYcuTdtC6J0",
    "x5t": "zxeg2WONpTkwN5GmeYcuTdtC6J0",
    "n": "vqEEyvePAnDTT2fd-E_MZm5i6AfwrkHwmWicYmHhsdLXnxVPNSuPjxmTe3UedZBU2Q6OUU5Dv5I4vjryhChnHIxamu4iZsumig8LL2_BqYQVqR6E1mmzpQubanJepJWvKW4aEgLelcK0EXnZSf-_uEPbR2MLgmXo7MW6a3qSqnxLYyQClxbtQML06E7ALXspTaQt7RA6qgtgK8sIuArhcdSghFnfWsQ9Ksr_CI96H50snLTQk9PBHAfwpPK80ha67tQ2uU08zZS_lADdpm0D3r_PgAyhTgaSOvSTGC02-Qv4vht3mG8B1oHprb0XB23B82jUEr6VQL6wbVkEwHU6Tw",
    "e": "AQAB",
    "x5c": [
        "MIIC/TCCAeWgAwIBAgIIC+Tj9FN8WEcwDQYJKoZIhvcNAQELBQAwLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDAeFw0yNDEwMjgxNjE3MzJaFw0yOTEwMjgxNjE3MzJaMC0xKzApBgNVBAMTImFjY291bnRzLmFjY2Vzc2NvbnRyb2wud2luZG93cy5uZXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+oQTK948CcNNPZ934T8xmbmLoB/CuQfCZaJxiYeGx0tefFU81K4+PGZN7dR51kFTZDo5RTkO/kji+OvKEKGccjFqa7iJmy6aKDwsvb8GphBWpHoTWabOlC5tqcl6kla8pbhoSAt6VwrQRedlJ/7+4Q9tHYwuCZejsxbprepKqfEtjJAKXFu1AwvToTsAteylNpC3tEDqqC2Arywi4CuFx1KCEWd9axD0qyv8Ij3ofnSyctNCT08EcB/Ck8rzSFrru1Da5TTzNlL+UAN2mbQPev8+ADKFOBpI69JMYLTb5C/i+G3eYbwHWgemtvRcHbcHzaNQSvpVAvrBtWQTAdTpPAgMBAAGjITAfMB0GA1UdDgQWBBSysAwN5iQubKofxkHPvn0l/dsXtDANBgkqhkiG9w0BAQsFAAOCAQEAjrxXa4+mGrj2F6o4LKng9G4YB18cQqXp3Vy2uVOeIF1MZVajOW+7bOG8UrFGXISL8zOLipj3IvFNjkEf8tFrdVbdWK+JhqtJGjdWE008RQ7fzIVUcBjlWwJwwBWHJZ7+mzJiDxY2TA0B9UyDAXm+k/KJUSA7+sCCNf101YY6aJmkYaPwb9UIdY3ebZ2ts3caTxuIyoxwG+mFguhrnZJ7vJBTz0LdaHJk+T1um8Mrx83ONmr+s8ZcqNQVufqNXkREQAT7pkSEQ3+FmiIFV2CIeEZHaXh0OOsqFbMR5hp1faHz4B+o6NsalEaDdl4lK8ft7zoPqRl4k2hGWeSYNvz9Pw=="
    ],
    "cloud_instance_name": "microsoftonline.com",
    "issuer": "https://login.microsoftonline.com/2b197efa-8e1b-4680-b263-8e237889b5b3/v2.0"
}
```

## Erweiterung Server

Sichern Sie den Endpunkt `/api/metrics` dahingehend ab, dass der Zugriff nur mit Hilfe eines gültigen Access Tokens
erfolgen kann. Verwenden Sie dabei NICHT die Implementierung aus dem SYP Projekt, sondern implementieren Sie
den Check wie bei dem vorangegangenen Beispielen direkt mit der Library `jsonwebtoken`.

Verwenden Sie für den Zugriff auf die Schlüssel die Library `jwks-rsa` und die callback-basierte
Variante von `jsonwebtoken.verify`.
