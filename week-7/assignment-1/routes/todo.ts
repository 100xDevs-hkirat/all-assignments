import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
import { Request, Response } from "express";
import { z } from "zod";
const router = express.Router();
interface TodoInputtypo {
  title: string;
  description: string;
}
router.post("/todos", authenticateJwt, (req: Request, res: Response) => {
  const data: TodoInputtypo = req.body;
  const done = false;
  const userId = req.headers["userId"];

  const newTodo = new Todo({
    title: data.title,
    description: data.description,
    done,
    userId,
  });

  newTodo
    .save()
    .then((savedTodo: Object) => {
      res.status(201).json(savedTodo);
    })
    .catch((err: any) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/todos", authenticateJwt, (req: Request, res: Response) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos: Object) => {
      res.json(todos);
    })
    .catch((err: any) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch(
  "/todos/:todoId/done",
  authenticateJwt,
  (req: Request, res: Response) => {
    const { todoId } = req.params;
    const userId = req.headers["userId"];

    Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { done: true },
      { new: true }
    )
      .then((updatedTodo: any) => {
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }
        res.json(updatedTodo);
      })
      .catch((err: any) => {
        res.status(500).json({ error: "Failed to update todo" });
      });
  }
);
