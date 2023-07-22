const fs = require("fs");
let fInput = "This is mohandeep";

fs.writeFile("tp.txt", fInput, (err) => {
  if (err) throw err;
  else {
    console.log("Done");
  }
});
