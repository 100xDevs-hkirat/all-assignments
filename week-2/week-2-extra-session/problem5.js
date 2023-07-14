/*
Parallel Execution with Callbacks:
Implement a function 'parallelFileOperation' that returns an array 
of size 2 with the first index containing the contents of the file 'a.txt'
in UTF-8 encoding. If a.txt doesn't exist, then throw an error. 
The second element of the array contains 1 if the text Hello! is 
successfully written to the file b.txt and 0 if the write operation fails.
*/

const fs = require("fs");
const path = require("path");

const readFileCallback = (fileName, callbackFn) => {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, "utf8", function (err, data) {
    if (!err) {
      callbackFn(data);
    } else {
      console.log(err);
    }
  });
};

const parallelFileOperation = (cbFn) => {
  const array = [];

  readFileCallback("a.txt", (data) => {
    array[0] = data;
  });

  readFileCallback("b.txt", (data) => {
    array[1] = data === "Hello!" ? 1 : 0;
    cbFn(array);
  });
};

parallelFileOperation((array) => {
  console.log(array);
});
