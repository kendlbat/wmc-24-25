# ANSWERS

## Blocking / long running operations

> Was versteht man unter blocking oder long running operations?

Blocking oder long running operations sind Operationen, die den Event-Loop blockieren und somit die Ausführung von weiteren Operationen verhindern. Das kann z.B. bei langen Schleifen, aufwändigen Berechnungen oder I/O-Operationen der Fall sein.

> Wie können solche im Browser bzw. in Node auftreten (konkrete Beispiele nennen oder durch Code zeigen)?

```js
import fs from "node:fs";
const data = fs.readFileSync('file.txt');
console.log(data);
```

> Welche Konsequenzen können solche Operationen für Node-Applikationen, insbesondere Web-Server haben?

Blocking-Operationen können dazu führen, dass der Server nicht mehr auf Anfragen reagiert und somit nicht mehr erreichbar ist.

> Was versteht man unter einer redos-attack?

Eine ReDoS-Attacke (Regular Expression Denial of Service) ist eine Art von DoS-Attacke, die auf einer Schwäche in der Implementierung von regulären Ausdrücken basiert. Ein Angreifer kann durch speziell präparierte Eingaben die Laufzeit von regulären Ausdrücken in die Höhe treiben und somit den Server lahmlegen.

## Eventloop

> Erklären Sie was die event loop im Runtime-Model von JavaScript für Aufgabe erfüllt und deren prinzipielle Funktionsweise.

Die Event-Loop ist ein Mechanismus, der die Ausführung von asynchronem Code in JavaScript steuert. Der Event-Loop wartet auf Events und führt Callbacks aus, wenn diese Events eintreten.
Der Event-Loop besteht aus einer Warteschlange für Events und einer Warteschlange für Callbacks.

## Run-to-completion

> Erklären Sie den Vor- und den Nachteil des “Run-to-completion” Konzepts in JavaScript (auch im Vergleich zu anderen Programmiersprachen, wie bspw. C oder Java).

Das run-to-completion Konzept bezeichnet die Eigenschaft von JavaScript, dass ein Event-Handler immer vollständig ausgeführt wird, bevor ein anderes Event bearbeitet wird.

Vorteil: Einfachheit und Vorhersagbarkeit des Verhaltens

Nachteil: Blocking-Operationen können die Ausführung von weiteren Operationen verhindern

## UI - Freeze

> Warum bleibt “friert” das Userinterface ein, obwohl setTimeout() genutzt wurde?

Das Userinterface friert ein, weil der Event-Loop blockiert wird. (Single-threaded)

> Demonstrieren Sie dieses Verhalten an einem Code-Beispiel Ihrer Wahl.

```js
document.querySelector('button').addEventListener('click', () => {
  setTimeout(() => {
    for (let i = 0; i < 1000000000; i++) {
      console.log(i);
    }
  }, 0);
});
```

## Micro- and Macro-Task

> Warum wird setTimeout(fn, 0) später ausgeführt als ein Promise.then()?

setTimeout wird als Macro-Task behandelt und wird somit erst nach allen Micro-Tasks ausgeführt.

> Demonstrieren Sie dieses Verhalten an einem Code-Beispiel Ihrer Wahl.

```js
console.log('start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
});

console.log('end');

// Output:
// start
// end
// promise
// setTimeout
```
