console.log("A");

// Die anonyme Funktion wird zur Task-Queue hinzugefügt
// Die Task-Queue wird erst _nach_ dem aktuellen Code-Block abgearbeitet
setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");

/*
Output: 
A C B
*/
