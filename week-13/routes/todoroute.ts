import express from "express";
import { authenticateJwt, SECRET } from "../middleware/authenticate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

interface CreateTodoInput {
  title: string;
  description: string;
}

router.post("/todos", authenticateJwt, async (req, res) => {
  try {
    const { title, description }: CreateTodoInput = req.body;
    const done = false;
    const userId = parseInt(req.headers.userId as string, 10);

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        done,
        authorId: userId,
      },
    });

    if (todo) {
      res.json({ message: "Todo created successfully." });
    } else {
      res.json({ error: "Failed to create to problem witha adding todo." });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/todos", authenticateJwt, async (req, res) => {
  try {
    const userId = parseInt(req.headers.userId as string);

    const todos = await prisma.todo.findMany({
      where: {
        authorId: userId,
      },
    });

    if (todos) {
      res.json({ todos });
    } else {
      res.json({ error: "Error while finding the todos." });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

router.patch("/todos/:todoId/done", authenticateJwt,async (req, res) => {
  try {
    const todoId = parseInt(req.params.todoId as string);

    const updatedTodo = await prisma.todo.update({
        where:{
            id:todoId
        },
        data:{
            done:true
        }
    })

    if(updatedTodo)
    {
        res.json({message:"Todo updated successfully."});
    }
    else{
        res.json({error:"Failed to update todo."});
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
});

export default router;
