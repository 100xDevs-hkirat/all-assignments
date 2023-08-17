"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../middleware/index");
const db_1 = require("../db");
const zod_1 = require("zod");
const router = express_1.default.Router();
const titleSchema = zod_1.z
    .string()
    .min(5, "Title length cannot be less than 5 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Title must contain only letters or numbers");
const descriptionSchema = zod_1.z
    .string()
    .min(5, "Description length cannot be less than 10 characters")
    .max(200, "Description length cannot be more than 200 characters");
router.post("/todos", index_1.authenticateJwt, (req, res) => {
    const toDoObject = req.body;
    const userId = req.headers["userId"];
    toDoObject.done = false;
    if (userId === undefined) {
        return res.status(400).json({ message: "UserId not received" });
    }
    else {
        toDoObject.userId = userId;
    }
    try {
        const validTitle = titleSchema.parse(toDoObject.title);
        const validDescription = descriptionSchema.parse(toDoObject.description);
        const newTodo = new db_1.Todo({
            title: validTitle,
            description: validDescription,
            done: toDoObject.done,
            userId: toDoObject.userId,
        });
        newTodo
            .save()
            .then((savedTodo) => {
            res.status(201).json(savedTodo);
        })
            .catch((err) => {
            res.status(500).json({ error: "Failed to create a new todo" });
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            const errorMessage = e.errors[0].message;
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(400).json({ message: "Error in adding todo" });
        }
    }
});
router.get("/todos", index_1.authenticateJwt, (req, res) => {
    const userId = req.headers["userId"];
    db_1.Todo.find({ userId })
        .then((todos) => {
        res.json(todos);
    })
        .catch((err) => {
        res.status(500).json({ error: "Failed to retrieve todos" });
    });
});
router.patch("/todos/:todoId/done", index_1.authenticateJwt, (req, res) => {
    const { todoId } = req.params;
    const userId = req.headers["userId"];
    db_1.Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
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
exports.default = router;
