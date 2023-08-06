var fs = require("fs");

function WriteDataToFile(data) {

  fs.writeFile("foo.txt", data, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("foo.txt", "utf8"));
    }
  });
}

let data = "This is a file containing a collection of books.";
WriteDataToFile(data);

console.log("file writing may not have completed at this point");
