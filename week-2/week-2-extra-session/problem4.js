/**
File Processing with Callback:
Write a function 'readFileCallback' that takes a filename and a
callback function. 'readFileCallback' should read the contents
of the file asynchronously and pass the data to the callback function.
 */

const fs = require("fs");
const path = require("path");

const readFileCallback = (fileName, callbackFn) => {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, "utf8", function (err, data) {
    if (!err) {
      callbackFn(data);
    }
  });
};

readFileCallback("test-file.txt", (data) => {
  console.log(data);
});
