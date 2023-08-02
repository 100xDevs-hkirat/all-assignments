
import express from 'express';
import { authenticateJwt, SECRET } from '../middleware/index';
import { Todo } from '../db';
const router = express.Router();


interface CreateTodoInput {
  title: string;
  description: string;
  done: boolean;
  userId: string;
}

// to check whether the user is sending a right value or not we use Zod for input validation libraries to fix if errorsnous data is sent

router.post('/todos', authenticateJwt, (req, res) => {
  const inputs: CreateTodoInput = req.body;
  const done = false;
  const userId = req.headers["user-id"];

  const newTodo = new Todo({ title: inputs.title, description: inputs.description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});

router.get('/todos', authenticateJwt, (req, res) => {
  const userId = req.headers["user-id"];

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
  const userId = req.headers["user-id"];

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