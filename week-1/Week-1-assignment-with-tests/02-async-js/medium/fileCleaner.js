const fs = require("fs");
function fileCleaner(file) {
  fs.readFile(file, (err, data) => {
    data = data
      .toString()
      .split(" ")
      .filter((item) => item !== "")
      .join(" ");

    fs.writeFileSync(file, data);
  });
}

fileCleaner("./data.txt");
