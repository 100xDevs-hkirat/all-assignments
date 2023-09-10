"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/todos", authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const done = false;
        const userId = parseInt(req.headers.userId, 10);
        const todo = yield prisma.todo.create({
            data: {
                title,
                description,
                done,
                authorId: userId,
            },
        });
        if (todo) {
            res.json({ message: "Todo created successfully." });
        }
        else {
            res.json({ error: "Failed to create to problem witha adding todo." });
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.get("/todos", authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.headers.userId);
        const todos = yield prisma.todo.findMany({
            where: {
                authorId: userId,
            },
        });
        if (todos) {
            res.json({ todos });
        }
        else {
            res.json({ error: "Error while finding the todos." });
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.patch("/todos/:todoId/done", authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = parseInt(req.params.todoId);
        const updatedTodo = yield prisma.todo.update({
            where: {
                id: todoId
            },
            data: {
                done: true
            }
        });
        if (updatedTodo) {
            res.json({ message: "Todo updated successfully." });
        }
        else {
            res.json({ error: "Failed to update todo." });
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
exports.default = router;
