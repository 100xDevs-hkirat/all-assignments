const fs = require("fs");
function parallelFileOperation(file1, file2) {
  (count = 0), (res = []);
  function readFile(err, data) {
    res[0] = data;
    count += 1;
    if (count === 2) console.log(res);
  }
  function writefile(err) {
    res[1] = !err ? 1 : 0;
    count += 1;
    if (count === 2) console.log(res);
  }
  fs.readFile(file1, "utf-8", readFile);
  fs.writeFile(file2, "Hello", writefile);
}

parallelFileOperation("./data.txt", "./b.txt");
