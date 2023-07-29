import {Request , Response, Router} from "express";
const { authenticateJwt, SECRET } = require("../middleware/index");
const { Todo } = require("../db");
const router = Router();

router.post('/todos', authenticateJwt, (req : Request, res : Response) => {
  const { title, description } = req.body;
  const done = false;
  const userId = req.body.userId;

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo : any) => {
      res.status(201).json(savedTodo);
    })
    .catch((err : Error) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req: Request, res: Response) => {
  const userId = req.body.userId;

  Todo.find({ userId })
    .then((todos : any) => {
      res.json(todos);
    })
    .catch((err : Error) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.body.userId;

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo : any) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err : Error) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

module.exports = router;