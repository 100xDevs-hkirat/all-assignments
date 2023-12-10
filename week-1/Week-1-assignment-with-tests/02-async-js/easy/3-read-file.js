const fs = require("fs");
fs.readFile("./3-read-file.txt", "utf8", (err, data) => {
  console.log("COntent ",data)
});
