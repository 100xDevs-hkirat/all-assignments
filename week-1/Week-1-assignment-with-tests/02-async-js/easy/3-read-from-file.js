// ## Reading the contents of a file

// Write code to read contents of a file and print it to the console. 
// You can use the fs library to as a black box, the goal is to understand async tasks. 
// Try to do an expensive operation below the file read and see how it affects the output. 
// Make the expensive operation more and more expensive and see how it affects the output. 

const fs  = required("fs");

function readFileContents(filePath, callback) {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

function expensiveOperation(callback) {
    setTimeout(() => {
        for (let i = 0; i < 1000; i++) {
        }

        callback();
    }, 1000);
}

const filePath = "example.txt";

readFileContents(filePath, (err, data) => {
    if (err) {
        console.error("Error reading File:", err);
    } else {
        console.log("File Contents:", data);

        expensiveOperation(() => {
            console.log("Expensive operation completed.");
        });
    }
});