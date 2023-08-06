import express, { Request, Response } from "express";
import { authenticateJwt } from "../middleware/index";
import config from "../config";
import { CreateTodoItem, TodoItem } from "../types";
import { Todo } from "../db";
import { z } from "zod";
const router = express.Router();

const ZodTodoInput = z.object({
  title: z.string().max(500),
  description: z.string().max(500),
});

router.post("/todos", authenticateJwt, (req: Request, res: Response) => {
  const parsedInput = ZodTodoInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: JSON.stringify(parsedInput.error) });
  }
  const input: CreateTodoItem = parsedInput.data;
  const done: boolean = false;
  const userId = req.headers["userId"];

  const newTodo = new Todo({
    title: input.title,
    description: input.description,
    done,
    userId,
  });

  newTodo
    .save()
    .then((savedTodo) => {
      const ans: TodoItem = {
        id: savedTodo._id.toString(),
        title: savedTodo.title,
        description: savedTodo.description,
        done: savedTodo.done,
      };
      res.status(201).json(ans);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/todos", authenticateJwt, (req: Request, res: Response) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      const ans: TodoItem[] = todos.map((todo) => ({
        id: todo._id.toString(),
        title: todo.title,
        description: todo.description,
        done: todo.done,
      }));
      res.json(ans);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

const ZodParam = z.object({
  todoId: z.string(),
});

router.patch(
  "/todos/:todoId/done",
  authenticateJwt,
  (req: Request, res: Response) => {
    const parsedInput = ZodParam.safeParse(req.params);
    if (!parsedInput.success) {
      const ans = { message: JSON.stringify(parsedInput.error) };
      return res.status(411).json(ans);
    }
    const { todoId } = parsedInput.data;
    const userId = req.headers["userId"];

    Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { done: true },
      { new: true }
    )
      .then((updatedTodo) => {
        if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found" });
        }
        const ans: TodoItem = {
          id: updatedTodo._id.toString(),
          title: updatedTodo.title,
          description: updatedTodo.description,
          done: updatedTodo.done,
        };
        res.json(ans);
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to update todo" });
      });
  }
);

export default router;
