const fs = require("fs");

fs.writeFile("./file.txt", "Hello World", "utf8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }

  console.log("File written!");
});

for (let i = 0; i < 1000; i++) {
  console.log(i);
}
