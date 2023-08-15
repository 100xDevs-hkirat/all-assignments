const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require("path");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    fs.readFile('file.json', 'utf-8', (err, data)=>{
        if (err) throw(err);
        res.json(JSON.parse(data));
    });
  });

app.get('/todos/:id', (req, res) =>{
    fs.readFile('file.json', 'utf-8', (err, data)=>{
        if (err) throw(err);
        let todos = JSON.parse(data);
        const todoindex = todos.findIndex(item=>item.id === parseInt(req.params.id))
        if (todoindex === -1) {
            res.status(404).send();
            } else {
            res.status(200).json(todos[todoindex]);
            }
    });

});

app.post('/todos', (req, res)=>{
    const todoItem = {
        id: Math.floor(Math.random() * 1000000), // unique random id
        title: req.body.title,
        description: req.body.description
      };
    fs.readFile('file.json', 'utf-8', (err, data)=>{
        if (err) throw(err);
        let todos = JSON.parse(data);
        todos.push(todoItem);
    fs.writeFile('file.json', JSON.stringify(todos),(err)=>{
        if (err) throw err;
        res.status(201).json(todoItem);
    });
    });
});






app.put('/todos/:id', (req, res) =>{
    fs.readFile('file.json', 'utf-8', (err, data)=>{
        if (err) throw(err);
        let todos = JSON.parse(data);
        const todoIndex = todos.findIndex(item => item.id === parseInt(req.params.id));
        if (todoIndex === -1){
            res.status(404).send();
        } else{
            const updatedTodo = {
                id: todos[todoIndex].id,
                title: req.body.title,
                description: req.body.description
              };
            todos[todoIndex] = updatedTodo;
            fs.writeFile('file.json',JSON.stringify(todos), (err)=>{
                if (err) throw err;
                res.status(201).json(updatedTodo);
            }); 
        }
    });

});

app.delete('/todos/:id', (req, res)=>{

    fs.readFile('file.json', 'utf-8', (err, data)=>{
        if (err) throw(err);
        let todos = JSON.parse(data);
        const todoIndex = todos.findIndex(item => item.id === parseInt(req.params.id));
        if(todoIndex === -1){
            res.status(404).send();  
        } else{
            var newTodos = [];
            for (var i =0; i < todos.length; i++){
                if(i != todoIndex){
                    newTodos.push(todos[i]);
                }
            }
        todos = newTodos;
        fs.writeFile('file.json', JSON.stringify(todos), (err)=>{
            if (err) throw (err);
            es.status(200).send();
        });
        }   
    });
});


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
      })
      

app.use((req, res, next) => {
    res.status(404).send();
  });



  // module.exports = app;
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
