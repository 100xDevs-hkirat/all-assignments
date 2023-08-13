import express, { Request, Response } from 'express'
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo, TodoValid } from "../db";
const router = express.Router();
import { z } from 'zod';



router.post('/todos', authenticateJwt, (req, res) => {
  try {
    const todo = TodoValid.parse(req.body);
    console.log("Todo Data Validated.");
    const { title, description } = todo;
    const done: boolean = false;
    const { userId } = req.headers;

    const newTodo = new Todo({ title, description, done, userId });

    newTodo.save()
      .then((savedTodo) => {
        res.status(201).json(savedTodo);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to create a new todo' });
      });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: `Request Data validation error ` });
  }
});


router.get('/todos', authenticateJwt, (req, res) => {
  const userId = req.headers.userId;

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers.userId;

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

export default router