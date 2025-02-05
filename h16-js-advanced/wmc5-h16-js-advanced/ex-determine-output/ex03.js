// Microtask-Queue
Promise.resolve().then(() => {
    console.log("A");
    // Hier wird vom Microtask noch ein Microtask hinzugefügt, dieser wird ebenfalls abgearbeitet, bevor die Task-Queue weiter behandelt wird
    Promise.resolve().then(() => console.log("B"));
});

console.log("C");

/*
Output: 
C A B
*/
