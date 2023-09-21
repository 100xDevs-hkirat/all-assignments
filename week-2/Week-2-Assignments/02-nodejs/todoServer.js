const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

let todoList = [];

app.get('/todos', (req, res) => {
  res.status(200).json(todoList);
});

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoList.find(todo => todo.id === id);
  if (index) {
    res.status(200).json(index);
  } else {
    res.status(404).send('The id is invalid');
  }
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  const id = Math.floor(Math.random() * 1000000)
  todoList.push(
    {
      id, title, description
    }
  )

  res.status(201).json({ id, title, description });

});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;

  const index = todoList.findIndex(todo => todo.id === id);

  if (index === -1) {
    res.status(404).send('Invalid id');
  } else {
    todoList[index].title = title;
    todoList[index].description = description;
    res.status(200).json(todoList[index]);
  }

});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = todoList.findIndex(todo => todo.id === id);

  if (index !== -1) {
    todoList.splice(index, 1);
    res.status(200).json(todoList);
  } else {
    res.status(404).send('Invalid id');
  }
});

app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(port, () => {
  console.log('listening on port', port);
})

module.exports = app;