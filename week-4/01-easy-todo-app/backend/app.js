const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json());

const Todo = require('./models/todoModel');


app.get("/api/v1/todos", async (req,res) => {
    const todo = await(Todo.find());

    res.status(200).json({
       status : "success",
       data : {
        todo
       }
    })
    
})



app.post("/api/v1/add", async (req,res) => { 
    try{ 
    
    const newTodo = await Todo.create(req.body);

    res.status(201).json({
        status: 'success',
        data: newTodo
    });
    } catch (err) {

        res.status(404).json({ status: 'fail', message: err});

     }
});

app.delete("/api/v1/delete/:id", async (req,res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({ status: "fail" , message: err })
    }
 });

 app.put('/api/v1/edit/:id', async (req, res) => {
    try {
      const todoId = req.params.id;
      const updateData = req.body;

      const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateData, {
        new: true,
      });
  
      res.status(200).json({
        status: 'success',
        data: {
          todo: updatedTodo,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  });


module.exports = app;