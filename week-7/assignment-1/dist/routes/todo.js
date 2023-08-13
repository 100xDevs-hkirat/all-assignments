"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../middleware/index");
const db_1 = require("../db");
const router = express_1.default.Router();
router.post('/todos', index_1.authenticateJwt, (req, res) => {
    try {
        const todo = db_1.TodoValid.parse(req.body);
        console.log("Todo Data Validated.");
        const { title, description } = todo;
        const done = false;
        const { userId } = req.headers;
        const newTodo = new db_1.Todo({ title, description, done, userId });
        newTodo.save()
            .then((savedTodo) => {
            res.status(201).json(savedTodo);
        })
            .catch((err) => {
            res.status(500).json({ error: 'Failed to create a new todo' });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Request Data validation error ` });
    }
});
router.get('/todos', index_1.authenticateJwt, (req, res) => {
    const userId = req.headers.userId;
    db_1.Todo.find({ userId })
        .then((todos) => {
        res.json(todos);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});
router.patch('/todos/:todoId/done', index_1.authenticateJwt, (req, res) => {
    const { todoId } = req.params;
    const userId = req.headers.userId;
    db_1.Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
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
exports.default = router;
