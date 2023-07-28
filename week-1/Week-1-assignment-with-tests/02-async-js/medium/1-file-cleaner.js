// ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman
// ```

const fs = require("fs");
fs.readFile('text.txt', 'utf8', (err, dataInitial) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(dataInitial);
  var dataModified = dataInitial.replace(/\s+/g, ' ').trim();
  console.log(dataModified);

  fs.writeFile('text.txt', dataModified, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File written successfully.');
  });
});