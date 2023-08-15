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

fs.readFile("a.txt", "utf-8", (err, content) => {
  if (err) {
    console.log("error reading file:", err);
    return;
  }
  console.log(content);

  content = content.replace(/ +/g, " ");

  console.log(content);

  fs.writeFile("b.txt", content, (err) => {
    if (err) {
      console.log("error writing to file:", err);
      return;
    }
    console.log("content added successfully");
  });
});
