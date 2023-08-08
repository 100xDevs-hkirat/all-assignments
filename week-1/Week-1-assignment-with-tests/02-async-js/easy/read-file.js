const fs = require("fs");

fs.readFile("./3-read-from-file.md", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  console.log("File contents:", data);
});

for (let i = 0; i < 1000000; i++) {
  console.log(i);
}
