import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
const router = express.Router();
import { z, ZodString } from "zod";

interface CreateToDoInput {
  title: string;
  description: string;
}

const CreateToDoInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

router.post("/todos", authenticateJwt, (req, res) => {
  try {
    const inputs: CreateToDoInput = CreateToDoInputSchema.parse(req.body);
    const done = false;
    const userId = req.headers["userId"];

    const newTodo = new Todo({
      title: inputs.title,
      description: inputs.description,
      done,
      userId,
    });

    newTodo
      .save()
      .then((savedTodo) => {
        res.status(201).json(savedTodo);
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to create a new todo" });
      });
  } catch (err) {
    res.status(400).json({ error: "Invalid input data" });
  }
});

router.get("/todos", authenticateJwt, (req, res) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch("/todos/:todoId/done", authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update todo" });
    });
});

export default router;
