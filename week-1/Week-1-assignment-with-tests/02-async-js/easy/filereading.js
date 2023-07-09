var fs = require("fs");
fs.readFile("3-read-from-file.md", (err, inputD) => {
  if (err) throw err;
  console.log(inputD.toString());
});
