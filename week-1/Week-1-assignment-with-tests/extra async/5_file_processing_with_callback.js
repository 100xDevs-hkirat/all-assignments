const fs = require("fs");
function readFileCallback(file, callback) {
  fs.readFile(file, callback);
}

readFileCallback("./data.txt", (err, data) => {
  console.log(data.toString());
});
