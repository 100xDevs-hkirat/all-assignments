const fs = require("fs");
fs.readFile("./1-file-cleaner.txt", "utf8", (err, data) => {
  fs.writeFile(
    "./1-file-cleaner.txt",
    data.replace(/\s+/g, " ").trim(),
    "utf8",
    (err) => {
      console.log("Done");
    }
  );
});
