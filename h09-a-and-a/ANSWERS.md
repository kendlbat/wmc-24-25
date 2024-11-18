### 3 Begrifflichkeiten

-   **Identity**: Wer bist du?
-   **Authentifizierung**: Bist du des wirklich?
-   **Autorisierung**: Was darfst du?

**Rolle des Session Managements bei Web Applikationen:**

Nach erfolgreicher Authentifizierung wird eine Session erstellt. Diese ermöglicht es, den Zustand eines Benutzers über mehrere Anfragen hinweg zu verfolgen.

### 4 Digital Identity

**Digitale Identität:**

Eine digitale Identität ist eine Sammlung von Informationen, die eine Person oder ein System im digitalen Raum eindeutig identifiziert. Diese Identität kann aus verschiedenen Attributen bestehen, die zusammen eine eindeutige Identifikation ermöglichen.

**Eigenschaften zur Identifikation einer Identität:**

-   Benutzername
-   E-Mail-Adresse
-   Telefonnummer
-   Biometrische Daten (Fingerabdruck, Gesichtserkennung)
-   Passwörter und PINs
-   Digitale Zertifikate
-   Social Media Profile

**Arten von Identitäten:**

-   **Personenbezogene Identitäten**: Identitäten, die Einzelpersonen zugeordnet sind.
-   **Geräteidentitäten**: Identitäten, die Geräten zugeordnet sind, wie z.B. Computern, Smartphones oder IoT-Geräten.
-   **Anwendungsidentitäten**: Identitäten, die Softwareanwendungen oder Diensten zugeordnet sind.
-   **Organisationsidentitäten**: Identitäten, die Organisationen oder Unternehmen zugeordnet sind.

### 5 JSON Web Token

**Dekodierung des JWT:**

a) **Teile eines JWT:**

-   Header: Enthält Metadaten über den Token, wie den verwendeten Signaturalgorithmus.
-   Payload: Enthält die Claims, also die eigentlichen Daten des Tokens.
-   Signature: Dient zur Verifizierung der Authentizität des Tokens.

b) **Algorithmus für die Signatur:**

-   Der Algorithmus ist "HS256" (HMAC mit SHA-256).

c) **Symmetrisches oder asymmetrisches Signaturverfahren:**

-   Es handelt sich um ein symmetrisches Signaturverfahren, da HMAC (Hash-based Message Authentication Code) verwendet wird.

d) **Szenarien für asymmetrische Verfahren:**

-   Asymmetrische Verfahren werden oft in Szenarien verwendet, in denen eine höhere Sicherheit erforderlich ist, wie z.B. bei der Kommunikation zwischen verschiedenen Systemen oder bei der Verifizierung von digitalen Signaturen, bei denen der private Schlüssel geheim bleibt und der öffentliche Schlüssel frei verteilt wird.

e) **Ist der JWT verschlüsselt?**

-   Nein, der JWT ist nicht verschlüsselt, sondern nur signiert. Die Daten im Payload sind Base64-codiert und können leicht dekodiert werden.

f) **Erklärung der verwendeten Claims:**

-   **aud**: Audience - Die Zielgruppe, für die der Token bestimmt ist.
-   **iat**: Issued At - Der Zeitpunkt, zu dem der Token erstellt wurde.
-   **exp**: Expiration - Der Zeitpunkt, zu dem der Token abläuft.
-   **upn**: User Principal Name - Der Benutzername des Benutzers.
-   **roles**: Rollen - Die Rollen, die dem Benutzer zugewiesen sind.

### 6 HTTP Cookies - Einstieg

**Cookies:**

Cookies sind kleine Textdateien, die von einer Website auf dem Gerät des Benutzers gespeichert werden. Sie enthalten Daten, die bei späteren Besuchen der Website wieder abgerufen werden können. Cookies werden verwendet, um den Benutzer zu identifizieren, Sitzungsinformationen zu speichern und personalisierte Inhalte bereitzustellen.

**Funktionsweise:**

-   Ein Webserver sendet ein Cookie an den Browser des Benutzers.
-   Der Browser speichert das Cookie und sendet es bei nachfolgenden Anfragen an denselben Server zurück.
-   Der Server kann die Informationen im Cookie verwenden, um den Benutzer zu identifizieren und den Zustand der Sitzung zu verwalten.

### 7 Cookies - Sicherheit

**Sicherheitsmechanismen für Cookies:**

-   **Secure-Flag**: Stellt sicher, dass das Cookie nur über HTTPS-Verbindungen übertragen wird.
-   **HttpOnly-Flag**: Verhindert den Zugriff auf das Cookie durch JavaScript, um Cross-Site Scripting (XSS) Angriffe zu verhindern.
-   **SameSite-Flag**: Verhindert, dass das Cookie bei Cross-Site-Anfragen gesendet wird, um Cross-Site Request Forgery (CSRF) Angriffe zu verhindern.
-   **Cookie-Verschlüsselung**: Verschlüsselt den Inhalt des Cookies, um sicherzustellen, dass sensible Informationen nicht im Klartext gespeichert werden.
-   **Cookie-Expiration**: Setzt ein Ablaufdatum für das Cookie, um sicherzustellen, dass es nicht unbegrenzt gültig bleibt.
