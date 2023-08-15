// ## Write to a file
// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks.

const fs = require("fs");

const filePath = __dirname + "/a.txt";
fs.readFile(filePath, "utf-8", (err, content) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  let str1 = content;
  let str2 = " new text.";
  let newStr = str1 + str2;
  console.log(newStr);

  fs.writeFile(filePath, newStr, (err) => {
    console.log("File successfully updated.");
  });
});
