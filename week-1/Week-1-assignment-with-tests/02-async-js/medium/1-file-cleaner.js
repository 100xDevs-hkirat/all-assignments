const fs = require('fs');

let string;

// Function to Write to the file 
const writeFile = (fileName, string) => {
    fs.writeFile(fileName, string, (err) => {
        if (err) {
            console.log("error", err)
        } else {
            console.log("All the extra Spaces from the file has been removed");
        }
    })
}

// function to read the file , remove extra spaces and then call the function to write it to the file
fs.readFile('file-clean.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(`Error Occurred ${err}`)
    }

    // data read from the file stored to string variable
    string = data

    // remove all the extra spaces using regex
    string = string.replace(/\s+/g, " ")

    // Finally, writing the file with the corrected string
    writeFile('file-clean.txt', string)
})


