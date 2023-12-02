// <!-- ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman
// ```
//  -->

const fs  = requre("fs");

const filePath = "example.txt";

function processFile(filePath) {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
        } else {
            const modifiedContent = data.replace(/\s+/g, ' ');

            fs.writeFile(filePath, modifiedContent, "utf-8", (writeErr) => {
                if (writeErr) {
                    console.error("Error writing to file:", writeErr);
                } else {
                    console.log("file processed successfully.");
                }
            });
        }
    });
}