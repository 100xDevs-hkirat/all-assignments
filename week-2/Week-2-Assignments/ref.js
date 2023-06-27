const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
 
app.get("/sum", (req, res) => {
  let counter = req.query.counter;

  let calsum = calculateSum(counter);
  let calmul = calculateMul(counter);

  let ansObj = {
    sum: calsum,
    mul: calmul,
  };
  res.status(200).send(ansObj);
});

app.post("/palindrome", (req, res) => {
  console.log(req.body);
  let inp = req.body.name;
  let ans = isPalindrome(inp);
  res.send(ans);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function calculateSum(n) {
  let count = 0;
  for (var i = 1; i <= n; i++) {
    count = count + i;
  }
  return count;
}

function calculateMul(n) {
  let count = 1;
  for (var i = 1; i <= n; i++) {
    count = count * i;
  }
  return count;
}

function isPalindrome(str1) {
  str1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (let i = 0; i < str1.length / 2; i++) {
    if (str1[i] != str1.at(i - 1 - 2 * i)) return false;
  }
  return true;
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
