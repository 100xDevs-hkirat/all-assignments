const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json()); // extracts post body & puts it in req.body

const customMiddleware = (req, res, next) => {
  const { query, headers, body } = req;
  if (query.counter > 999 || headers.counter > 999 || body.counter > 999) {
    res.status(401).send(`some counter is greateter thanh 900`);
  } else {
    next(); // allows to go to route handler -> app.get's callback
  }
};

app.use(customMiddleware);

const handleFirstRequest = (req, res) => {
  const { query, headers, body } = req;
  const calculateSum = (counter) => (+counter * (+counter + 1)) / 2;
  /*res.send(`${JSON.stringify({ query, headers, body })}
    \n query.counter sum is ${calculateSum(query.counter)}
    \n headers.counter sum is ${calculateSum(headers.counter)}
    \n body.counter sum is ${calculateSum(body.counter)}
    `);*/
  res.send({ sum: calculateSum(query.counter) });
};

app.get("/handleSum", handleFirstRequest);
//app.post("/handleSum", handleFirstRequest);

///// HTML Response
const givePage = (req, res) => {
  res.send(
    "<head><title>Hello</title></head><body><i>Hi this is a html code sent directly</i></body>"
  );
};

const givePageFromFile = (req, res) => {
  res.sendFile(__dirname + "/index.html");
};

app.get("/", givePage);
app.get("/pageFromFile", givePageFromFile);

const started = () => {
  console.log(`Example app listening on port ${port}`);
};

app.listen(port, started);
