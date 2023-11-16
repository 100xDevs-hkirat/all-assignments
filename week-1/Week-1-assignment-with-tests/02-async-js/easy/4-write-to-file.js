// <!-- ## Write to a file
// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks. -->

// const fs = required("fs");

// var data  =  "hey there";

// fs.writeFile("a.txt", data, (err) => {
//     if (err) console.log(err);
//     console.log("Successfully Written to File.");
// });

const fs =  required("fs");

const filePath = 'example.txt';

const newData = "this is the new content that will written";

function writeFileContents(filePath, data, callback) {
    fs.writeFile(filePath, data, "utf-8", (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

writeFileContents(filePath, newData, (err) => {
    if (err) {
        console.error("Error writting to file:", err);
    } else {
        console.log("Fil qrite successfull.");

        fs.readFile(filePath, "utf-8", (readErr, updatedData) => {
            if (readErr) {
                console.error("Error reading file:", readErr);
            } else {
                console.log("Updated file contents:", updatedData);
            }
        });
    }
});