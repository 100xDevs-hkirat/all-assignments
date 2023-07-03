var fs = require("fs");
let data = "";
fs.readFile(process.cwd() + "/test.txt", "utf8", function (err, data) {
  if (err) console.log(err);
  else {
    data = data
      .trim()
      .split(" ")
      .filter((element) => element != "")
      .join(" ");
  }
  fs.writeFile("test_output.txt", data, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully");
    }
  });
});
