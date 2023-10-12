const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());

let todos = [];

app.get("/todos", (req, res) => {
  fs.readFile('todos.json', 'utf8', (err, data) => {
    if(err) throw err;
    res.json(JSON.parse(data));
  })
});

app.get("/todos/:id", (req, res) => {
  fs.readFile('todos.json', 'utf8', (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todo = todos.find(t => t.id === +(req.params.id));
    if(!todo) {
      res.status(404).send("Todo not Found");
    }
    else {
      res.json(todo);
    };
  })
});

app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 100000),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile('todos.json', (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
      if(err) throw err;
      res.status(201).json(newTodo);
    })
  })
});

app.put("/todos/:id", (req, res) => {
  fs.readFile('todos.json', 'utf8', (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex(todo => todo.id === +req.params.id);
    console.log('index' + todoIndex)
    if(todoIndex === -1) {
      res.status(404).send("Todo not Found");
    }
    else {
      const updatedTodo = {
        ...todos[todoIndex],
        title: req.body.title,
        description: req.body.description,
      };

      todos[todoIndex] = updatedTodo;
      console.log(updatedTodo)
      fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
        if(err) throw err;
        res.status(200).json(updatedTodo);
      })
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile('todos.json', 'utf8', (err, data) => {
    if(err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex(todo => todo.id === +req.params.id);
    if(todoIndex === -1) {
      res.status(404).send("Todo not Found");
    }
    else {
      todos.splice(todoIndex, 1);
      fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
        if(err) throw err;
        res.status(200).send("todo item was found and deleted");
      })
    }
  });
});

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res) => {
  res.status(404).send();
});

app.listen(3000);
module.exports = app;
