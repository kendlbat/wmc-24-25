setTimeout(() => console.log("A"), 0);
setImmediate(() => console.log("B"));

/*
Hier sieht man schön, dass die Microtask-Queue Priorität vor der Task-Queue hat.

Output:
B A
*/
