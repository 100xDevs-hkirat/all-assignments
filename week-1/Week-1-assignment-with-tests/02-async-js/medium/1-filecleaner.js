var fs = require("fs");

function ReadCleanandDisplayFile(fn) {
  fs.readFile(fn, "utf8", function (err, data) {
    if (err) {
      console.error(err);
    }
    data = data.replace(/\s\s+/g, " ");
    console.log(data);
    console.log("file reading complete!");
  });
}

const fn = "fil.txt";
ReadCleanandDisplayFile(fn);
