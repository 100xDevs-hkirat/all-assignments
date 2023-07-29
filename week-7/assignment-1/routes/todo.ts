import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/";
import { Todo } from "../db";
import {z} from 'zod';
const router = express.Router();

interface todoType {
    title:string;
    description:string;
}

const zodTodoInputSchema = z.object({
    title: z.string().min(0).max(50),
    description: z.string().min(0).max(1000)
});
router.post('/todos', authenticateJwt, (req, res) => {
    try
    {
        const {title, description}: todoType = zodTodoInputSchema.parse(req.body);
        const done = false;
        const userId = req.headers["userId"];

        const newTodo = new Todo({title, description, done, userId});

        newTodo.save()
            .then((savedTodo) => {
                res.status(201).json(savedTodo);
            })
            .catch((err) => {
                res.status(500).json({error: 'Failed to create a new todo'});
            });
    }
    catch (e){
        res.status(400).json({ error: e });
    }
});


router.get('/todos', authenticateJwt, (req, res) => {
  const userId = req.headers["userId"];

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
  const userId = req.headers["userId"];

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