/*
Sequential Execution with Callbacks:
Create a function 'series' that sequentially does the following.
Read the contents of a.txt using UTF-8 encoding.
Wait for 3 seconds.
Write the contents of a.txt in b.txt.
Remove any extra spacing from a.txt.(refer to kirat's async 'file-cleaner' problem from week 1)
delete the contents of a.txt.
delete the contents of b.txt.
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
const writeFile = (fileName, writeText, emptyCb) => {
  const filePath = path.join(__dirname, fileName);
  fs.writeFile(filePath, writeText, function (err) {
    if (err) {
      console.log(err);
    } else {
      emptyCb();
    }
  });
};

const series = () => {
  readFileCallback("a.txt", (fileAData) => {
    console.log(`read file a.txt contents`);
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      console.log(`waiting for ${counter} seconds`);
      counter === 3 && clearInterval(intervalId);
    }, 1000);

    setTimeout(() => {
      writeFile("b.txt", fileAData, () => {
        readFileCallback("b.txt", (fileBData) => {
          console.log(`b.txt contents: ${fileBData}`);
        });
      });
    }, 3000);
  });
};

series();
