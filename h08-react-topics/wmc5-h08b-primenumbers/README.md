# Refactoring UI

Gegeben ist eine Implementierung einer einfachen Komponente `PrimeNumbers`,
die die Anzahl der Primzahlen bis zu einem gegebenen Maximalwert bestimmt.
Die Implementierung des Algorithmus ist recht trivial, dient aber nur
als Beispiel für eine lang dauernde, aufwändige Operation.

Wie verhält sich die UI, wenn hohe Werte wie 500.000 für den Maximalwert
gewählt werden? Warum ist dieses Verhalten auch beobachtbar, wenn die Schriftgröße geändert wird?
Weil die Daten bei jedem Rerender neu berechnet werden.

1. Verbessern Sie die Implementierung dahingehend, dass `useMemo` verwendet wird.
   Welche Auswirkung hat `useMemo` auf die Performance auf der Komponente?
   Perfomance-Einbrüche nur mehr einmalig bei der Berechnung der Primzahlen

2. Ersetzen Sie `useState` für die Eigenschaft `textSize`, `fontWeight` und `textColor` durch das `useReducer` Pattern.
   Halten Sie sich dabei an die Konventionen, die in der React Dokumentation <https://react.dev/learn/extracting-state-logic-into-a-reducer>
   vorgeben sind.
