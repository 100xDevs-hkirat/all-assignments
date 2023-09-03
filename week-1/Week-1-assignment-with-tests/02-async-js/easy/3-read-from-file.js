const fs = require('fs');

function expensiveOperation() {
    let count = 0;
    for (let i = 0; i < 1000000000; i++) {
        count++;
    }
    console.log(count)
}

fs.readFile('3-read-from-file.md', 'utf8', (error, data) => {
    if (error) {
        console.log(`Error Occurred when reading from file`, error);
    }

    console.log(data);

})

// Doing a Computational Expensive Operation, as It is Syncronous , JS will do it first and then move on to fs.readFile() as it is Async
expensiveOperation();