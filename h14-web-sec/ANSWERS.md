# ANSWERS

## Broken Access Control  

-   **Allgemeines**: “Broken Access Control” bezeichnet Schwachstellen, bei denen Benutzerfunktionen oder -daten auf eine Weise zugänglich sind, die nicht den Berechtigungen entspricht.  
-   **Vertikale Schwachstelle**: Ein Benutzer mit geringeren Rechten erlangt Zugriff auf Funktionen/Informationen, die nur Nutzern mit höheren Rechten (z. B. Admins) vorbehalten sind.  
-   **Horizontale Schwachstelle**: Ein Benutzer greift auf Daten oder Funktionen eines anderen Benutzers mit gleichen Rechten zu.  
-   **Kontextabhängig**: Zugriff wird durch das System in einem bestimmten Kontext (etwa während einer Session oder unter bestimmten Bedingungen) falsch eingeschränkt, sodass Funktionen/Daten unberechtigt manipulierbar sind.

## NVD und CVE  

-   **NVD (National Vulnerability Database)**: Eine von der US-Regierung (NIST) bereitgestellte, öffentliche Datenbank mit Sicherheitslücken, die u. a. Schweregrade und Informationen zu Patches enthält.  
-   **CVE (Common Vulnerabilities and Exposures)**: Eindeutige Kennungen für bekannte Sicherheitslücken (z. B. CVE-2023-1234), die eine standardisierte Referenz ermöglichen.  
-   **Zusammenhang**: Die NVD ergänzt CVE-Einträge um zusätzliche Daten (etwa CVSS-Scores), sodass Schwachstellen schneller bewertet und behoben werden können.

## npm audit  

-   **Funktion**: Der Befehl `npm audit` sucht in den installierten Node.js-Paketen nach bekannten Schwachstellen und gibt eine Übersicht über deren Schweregrad.  
-   **Vorgehen**: Er gleicht die Paketversionen mit einer Sicherheitsdatenbank ab und liefert Empfehlungen für Updates bzw. Patches.  
-   **Nutzen**: Hilft Entwicklern, schnell auf unsichere Abhängigkeiten zu reagieren und sie zu beheben, um Node-Projekte sicherer zu machen.

## Injections – Cross-Site Scripting (XSS)

### Was ist XSS und wie funktioniert es?

-   **Definition**: XSS ist eine Schwachstelle, bei der ein Angreifer bösartigen Code (typischerweise JavaScript) in eine Webseite einschleust.  
-   **Funktionsweise**: Der Browser eines Opfers führt diesen eingeschleusten Code beim Aufrufen der manipulierten Seite aus, beispielsweise durch ungesicherte Eingabefelder oder Parameter in URLs.

### Welche Auswirkungen hätten (erfolgreiche) Angriffe?

-   **Session-Diebstahl**: Ein Angreifer kann Cookies oder Sitzungsinformationen auslesen und sich so als das Opfer ausgeben.  
-   **Malware-Auslieferung**: Nutzern können unerwünschte Skripte oder sogar Schadsoftware untergejubelt werden.  
-   **Manipulation von Inhalten**: Der Angreifer kann gezielt Daten manipulieren oder Benutzer täuschen (z. B. durch gefälschte Formulare).

### Welche Gegenmaßnahmen können getroffen werden?

-   **Eingabe validieren und bereinigen**: Nutzer- und URL-Eingaben sollten gefiltert oder kodiert werden (z. B. HTML- oder JavaScript-Escaping).  
-   **Content Security Policy (CSP)**: Einschränkung der erlaubten Skriptquellen reduziert die Ausnutzbarkeit von XSS-Lücken.  
-   **HTTP-Only Cookies**: Cookies nicht mit JavaScript zugreifbar machen, um Session-Diebstahl zu erschweren.  
-   **Regelmäßige Tests**: Security-Scans und Penetrationstests, um mögliche XSS-Stellen frühzeitig zu entdecken und zu beheben.
