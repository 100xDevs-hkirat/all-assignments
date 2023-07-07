const fs = require('fs');

const Data = `## Write to a file
Using the fs library again, try to write to the contents of a file.
You can use the fs library to as a black box, the goal is to understand async tasks.

This extra line is written by me using fs library of Node.js
`

fs.writeFile('4-write-to-file.md', Data, (err) => {
    if (err) {
        console.log(`Error Occurred, ${err}`)
    } else {
        console.log("File has been written Successfully");
    }
})

