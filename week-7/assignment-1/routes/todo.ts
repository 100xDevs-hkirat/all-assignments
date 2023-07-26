// const express = require('express');
// const { authenticateJwt, SECRET } = require("../middleware/index");
// const { Todo } = require("../db");
import express, { Request, Response } from 'express';
import { authenticateJwt, SECRET } from '../middleware/index';
import { Todo } from '../db/index';
import { IRequest } from '../interfaces/IRequest';
import { IResponse } from '../interfaces/IResponse';

const router = express.Router();

router.post('/todos', authenticateJwt, (req: IRequest, res: IResponse) => {
  const { title, description } = req.body;
  const done = false;
  const userId = req.userId;

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req: IRequest, res: IResponse) => {
  const userId = req.userId;

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req: IRequest, res: Response) => {
  const { todoId } = req.params;
  const userId = req.userId;

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

// module.exports = router;
export default router;