# h13-oauth2-oidc

## Authorization Code Flow

### Für welche Arten von Clients kann dieser Flow verwendet werden?  

Confidential Clients (Clients, die Secrets halten können: Backend)

### Wozu dient die Redirect URI?  

Sorgt dafür, dass die Authorization nur funktioniert, wenn der Authorization Server den Client kennt.

### Welchen Zweck hat die Erweiterung PKCE?  

Bei der Autorisierungsanfrage wird eine Challenge mitgeliefert, die der Client bei der Tokenanfrage wiederholen muss. Das verhindert, dass ein Angreifer den Autorisierungscode abfängt und damit ein Access Token erhält.

## OpenID Connect (OIDC)

OIDC erweitert das OAuth2-Protokoll um einen Identity Token (ID Token), über den der Client Informationen zur Authentifizierung (z. B. die User-ID oder E-Mail) erhält. Access token bleibt wie normal.
Mit OIDC ist also in einem Zug sowohl die Authentifizierung (Who is the user?) als auch die Autorisierung (What is the user allowed to do?) möglich.

## Arten von Token

-   Access Token  
    -   erlaubt Zugriff auf geschützte Ressourcen via claims (z. B. `scope`, `roles`, `client_id`)
    -   sehr kurze Gültigkeit (z. B. 15 Minuten bis 1 Stunde)

-   Refresh Token  
    -   dient zur Erneuerung des Access Tokens
    -   länger gültig als Access Tokens (oft Wochen bis Monate)

-   Identity Token  
    -   kommt von OIDC, ermöglicht die Identifikation des Nutzers
    -   wird nach Erhalt üblicherweise nicht mehr übertragen

## Unterschiede Access vs. Identity Tokens

-   Welche SW Komponente verwendet den access token bzw. den identity token?
    Der Client verwendet den Access Token, um auf geschützte Ressourcen zuzugreifen. Der Identity Token wird verwendet, um den Nutzer zu identifizieren.

-   Welche Gültigkeitsdauer haben die beiden Token?
    Identity Token: 1h 5min
    Access Token: 1h 30min

-   Welche Claims beinhalten die beiden Tokens? Welche Gemeinsamkeiten bzw. Unterschiede
können Sie erkennen?
    -   Gemeinsame Claims: `aud`, `iss`, `iat`, `nbf`, `exp`, `family_name`, `given_name`, `ipaddr`, `name`, `oid`, `rh`, `sub`, `tid`, `uti`, `ver`.
    -   Access Token specific: `acr`, `aio`, `amr`, `appid`, `appidacr`, `onprem_sid`, `scp`, `unique_name`, `upn`.
    -   Identity Token specific: `auth_time`, `ctry`, `preferred_username`.
