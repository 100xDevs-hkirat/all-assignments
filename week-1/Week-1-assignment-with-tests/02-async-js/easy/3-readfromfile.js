var fs = require("fs");

function ReadandDisplayFile(fn) {
  fs.readFile(fn, "utf8", function (err, data) {
    if (err) {
      console.error(err);
    }
    console.log(data);
    console.log("file reading complete!");
  });
}

const fn = "fil.txt";
ReadandDisplayFile(fn);
console.log("file reading may not have completed at this point");

// // expensive operation
// count = 0
// for (let i = 0; i < 1000000000; i++) {
//   count += 1;
// }

// expensive operation
count = 0;
for (let i = 0; i < 100; i++) {
  count += 1;
}
console.log("file reading may not have completed at this point");
