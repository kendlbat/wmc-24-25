# Answers

## Functional components

> Erklären Sie das Konzept von functional components, wie sie in React verwendet werden. Was versteht man in diesem Zusammenhang unter einer pure function?

Functional components sind React-Komponenten, die als Funktionen implementiert sind. Sie haben keine eigene Instanz und keinen eigenen Zustand. Sie erhalten ihre Daten ausschließlich über die `props` und geben JSX zurück. Sie sind einfacher zu schreiben und zu testen als Klassenkomponenten.

Eine pure function ist eine Funktion, die keine Seiteneffekte hat und immer den gleichen Wert für die gleichen Argumente zurückgibt. In React sind funktionale Komponenten pure functions, da sie keine Seiteneffekte haben und nur von ihren `props` abhängen.

## Rendering

> Erklären Sie wie React das Rendering der Komponenten implementiert. Wozu dient der Virtual DOM? Welche Probleme ergeben sich dabei bei direktem Zugriff auf den DOM Tree, zB. mittels `document.getElementById`?

React rendert Komponenten in einem virtuellen DOM, bevor es die Änderungen auf den echten DOM anwendet. Der virtuelle DOM ist eine Kopie des echten DOM, die React intern verwaltet. React vergleicht den virtuellen DOM mit dem echten DOM und wendet nur die Änderungen an, die tatsächlich vorgenommen wurden. Dadurch wird das Rendering effizienter und schneller als bei direktem Zugriff auf den DOM Tree.

Bei direktem Zugriff auf den DOM Tree, z.B. mittels `document.getElementById`, um Elemente zu manipulieren oder zu ändern

-   wird der virtuelle DOM umgangen
-   können unerwartete Seiteneffekte auftreten
-   kann es zu inkonsistenten Zuständen kommen

## State lifting

> Erklären Sie anhand eines selbst gewählten Beispiels wozu das state lifting verwendet wird.

State lifting wird verwendet, um den Zustand (state) einer Komponente in eine übergeordnete Komponente zu verschieben. Dadurch können mehrere Komponenten den gleichen Zustand teilen und miteinander kommunizieren. Ein Beispiel dafür ist ein Formular, bei dem die Eingaben in mehreren Feldern zusammengefasst und in einer übergeordneten Komponente gespeichert werden. Dadurch können die einzelnen Felder den Zustand der Formular-Komponente lesen und schreiben.

```jsx
import React, { useState } from "react";

function Form() {
    const [formData, setFormData] = useState({ name: "", email: "" });
    return (
        <div>
            <FormNameInput
                value={formData.name}
                onChange={(name) => setFormData({ ...formData, name })}
            />
            <FormEmailInput
                value={formData.email}
                onChange={(email) => setFormData({ ...formData, email })}
            />
        </div>
    );
}

export default Form;
```
