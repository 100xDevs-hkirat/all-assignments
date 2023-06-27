const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs")
const port = 3000;
const path = require("path")
const app = express();

let data = [];

app.use(bodyParser.json());

app.get('/todos', getTodos);

function getTodos(req, res) {
  fs.readFile("todos.json", "utf-8", (err,data) => {
    if(err) throw err;
    res.status(200).json(JSON.parse(data));

  })
}

app.get('/todos/:id', (req, res) => {
  const id = req.params.id - 1;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);

    if (id >= 0 && id < todos.length) {
      res.status(200).json(todos[id]);
    } else {
      res.status(404).json('Todo item not found');
    }
  });
});


app.post('/todos', (req, res) => {
  const todoItem = req.body;

  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    let todos = [];
    if (data) {
      // Parse existing data if the file is not empty
      todos = JSON.parse(data);
    }
    
    todos.push(todoItem);

    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;

      res.status(201).json({ id: todoItem.id, message: "Added data" });
    });
  });
});




app.put('/todos/:id', (req, res) => {
  const id = req.params.id - 1;
  if (id >= 0 && id < data.length) {
    const todoItem = {
      id: id + 1,
      title: req.body.title,
      completed: req.body.completed,
      description: req.body.description,
    };
    data[id] = todoItem;
    res.status(200).json({ id: todoItem.id });
  } else {
    res.status(404).json('Todo item not found');
  }
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id - 1;
  if (id >= 0 && id < data.length) {
    data.splice(id, 1);
    res.status(200).json('Todo item deleted successfully!');
  } else {
    res.status(404).json('Todo item not found');
  }
});

app.get("/", (req,res)=> {
  res.sendFile(path.join(__dirname + "/index.html"))
})
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


module.exports = app;
