import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
import { z } from "zod";
import {
  getTodosInput,
  handleValidation,
  postTodoInputs,
  updateTodosInput,
} from "./helper";
const router = express.Router();

router.post("/todos", authenticateJwt, (req, res) => {
  const parsedInputs = postTodoInputs.safeParse(req.body);

  if (!parsedInputs.success) {
    handleValidation(parsedInputs, res);
    return;
  }

  const { title, description, userId } = parsedInputs.data;
  const done = false;

  const newTodo = new Todo({ title, description, done, userId });

  newTodo
    .save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/todos", authenticateJwt, (req, res) => {
  const parsedInputs = getTodosInput.safeParse(req.body);

  if (!parsedInputs.success) {
    handleValidation(parsedInputs, res);
    return;
  }

  const { userId } = parsedInputs.data;

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch("/todos/:todoId/done", authenticateJwt, (req, res) => {
  const parsedInputs = updateTodosInput.safeParse(req.params);
  const userId = z.string().min(1).safeParse(req.headers.userId);

  if (!parsedInputs.success || !userId.success) {
    handleValidation(parsedInputs, res);
    handleValidation(userId, res);
    return;
  }
  const { todoId } = parsedInputs.data;

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
