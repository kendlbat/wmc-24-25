console.log("A");

// Die anonyme Funktion wird zur Task-Queue hinzugefügt
setTimeout(() => {
    console.log("B");
}, 0);

// Hier wird die anonyme Funktion zur Microtask-Queue hinzugefügt
// Die Microtask-Queue wird _vor_ der Task-Queue abgearbeitet, aber ebenfalls erst nach dem aktuellen Code-Block
Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");

/*
Output:
A D C B
*/
