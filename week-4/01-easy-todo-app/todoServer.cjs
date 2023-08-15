
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  const path = require("path");
  const cors = require("cors");
  
  app.use(express.static('public'));
  app.use(cors());
  app.use(bodyParser.json());
  
  let todos = [];
  
  app.get('/todos', (req, res) => {
    res.json(todos);
  });
  
  app.get('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(item => item.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.status(200).json(todos[todoIndex]);
    }
  });
  
  app.post('/todos', (req, res) => {
    const todoItem = {
      id: Math.floor(Math.random() * 1000000), // unique random id
      title: req.body.title,
      description: req.body.description
    };
    todos.push(todoItem);
    res.status(201).json(todoItem);
  });
  
  app.put('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(item => item.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos[todoIndex].title = req.body.title;
      todos[todoIndex].description = req.body.description;
      res.json(todos[todoIndex]);
    }
  });
  
  app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(item => item.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      var newTodos = [];
      for (var i = 0; i < todos.length; i++) {
        if (i !== todoIndex) {
          newTodos.push(todos[i]);
        }
      }
      todos = newTodos;
      res.json(newTodos);
    }
  });
  

  app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
      })

  // For all other routes, return 404
  app.use((req, res, next) => {
    res.status(404).send();
  });
    // module.exports = app;
    app.listen(3000, () => {
      console.log(`Example app listening on port 3000`)
    })
  