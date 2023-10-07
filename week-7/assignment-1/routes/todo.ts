import express, { Request, Response } from 'express';
const { authenticateJwt, SECRET } = require("../middleware/index");
import { Todo } from "../db";
const router = express.Router();

interface TodoType {
  title: string;
  description: string;
}

router.post('/todos', authenticateJwt, (req: Request, res: Response) => {
  const todo: TodoType = req.body;
  const done = false;
  const userId = req.headers['userId'];

  const newTodo = new Todo({ title: todo.title, description: todo.description, done, userId });
  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});

router.get('/todos', authenticateJwt, (req, res) => {
  const userId = req.headers['userId'];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

// ? patch : it is similar to put 
router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers['userId'];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

export default router;

// const express = require("express");
// const { authenticateJwt, SECRET } = require("../middleware/index");
// const { Todo } = require("../db");
// const router = express.Router();

// // Route to Post the todo to database
// router.post("/todos", authenticateJwt, async (req, res) => {
//   const {title} = req.body;
//   const todoExist = await Todo.findOne({ title });
//   console.log("todoExist : ", todoExist);
//   if (todoExist) {
//     res.status(401).send("this todo already exists !");
//   } else {
//     const newTodo = await new Todo(req.body);
//     await newTodo.save();
//     res.json({
//       todo: req.body,
//       message: "Todo Added Sucesfully !",
//     });
//   }
// });

// // Route to Get the Todos from database
// router.get('/todos', authenticateJwt, async (req, res) => {
//   await Todo.find({}).then((data) => {
//     res.json({todos: data});
//   }).catch((err) => {
//     res.status(404).send(err);
//   })
// })

// module.exports = router;
