import express from "express"
import { authenticateJwt, SECRET } from "../middleware/index"
import { Todo } from "../db"
import { z } from "zod"
const router = express.Router()

interface AddToDoObject {
    title: string
    description: string
    done: boolean
    userId: string
}

const titleSchema = z
    .string()
    .min(5, "Title length cannot be less than 5 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Title must contain only letters or numbers")

const descriptionSchema = z
    .string()
    .min(5, "Description length cannot be less than 10 characters")
    .max(200, "Description length cannot be more than 200 characters")

router.post("/todos", authenticateJwt, (req, res) => {
    const toDoObject: AddToDoObject = req.body
    const userId = req.headers["userId"]
    toDoObject.done = false
    if (userId === undefined) {
        return res.status(400).json({ message: "UserId not received" })
    } else {
        toDoObject.userId = userId as string
    }

    try {
        const validTitle = titleSchema.parse(toDoObject.title)
        const validDescription = descriptionSchema.parse(toDoObject.description)

        const newTodo = new Todo({
            title: validTitle,
            description: validDescription,
            done: toDoObject.done,
            userId: toDoObject.userId,
        })

        newTodo
            .save()
            .then((savedTodo) => {
                res.status(201).json(savedTodo)
            })
            .catch((err) => {
                res.status(500).json({ error: "Failed to create a new todo" })
            })
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errorMessage = e.errors[0].message
            res.status(400).json({ message: errorMessage })
        } else {
            res.status(400).json({ message: "Error in adding todo" })
        }
    }
})

router.get("/todos", authenticateJwt, (req, res) => {
    const userId = req.headers["userId"]

    Todo.find({ userId })
        .then((todos) => {
            res.json(todos)
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to retrieve todos" })
        })
})

router.patch("/todos/:todoId/done", authenticateJwt, (req, res) => {
    const { todoId } = req.params
    const userId = req.headers["userId"]

    Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
        .then((updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).json({ error: "Todo not found" })
            }
            res.json(updatedTodo)
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to update todo" })
        })
})

export default router
