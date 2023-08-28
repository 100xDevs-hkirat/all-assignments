const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
let todos = []; 

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get("/todos", (req, res) => {
  res.json(todos);
});
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    title: req.body.title,
    description: req.body.description,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
app.delete("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }
});

// for all other routes, return 404
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // use in oeder to open the html file inlocalhosdt:3000
});

// app.use((req, res, next) => {
//   res.status(404).send();
// });

app.listen(3000);
