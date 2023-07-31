const fs = require("fs");

function readFile(file) {
  fs.readFile(file, (err, data) => {
    console.log(data.toString());
  });
  //   const data = fs.readFileSync(file);   -> This one blocks thread of execution.
  //   console.log(data);
  for (let i = 0, sum = 0; i < 1000000000; i++) {
    sum += i;
  }
  console.log("data read done");
}

readFile("./data.txt");
console.log("closing program");
