const fs = require("fs");

function writeFile(file, data) {
  fs.writeFile(file, data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });

  //   fs.writeFileSync(file, data);
  //   console.log("Data written to file successfully using writeFileSync.");  // writeFileSync blocks thread of execution
}

writeFile("./data.txt", `Timestamp is ${Date.now()}`);
console.log("This should get printed after writing file");
