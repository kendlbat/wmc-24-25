console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve()
    .then(() => {
        console.log("C");
        setTimeout(() => {
            console.log("D");
        }, 0);
        return Promise.resolve();
    })
    .then(() => {
        console.log("E");
    });

console.log("F");

/*
Output:
A F C E B D
*/
