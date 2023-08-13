"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.User = exports.UserValidation = exports.TodoValid = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.TodoValid = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(3),
});
exports.UserValidation = zod_1.z.object({
    username: zod_1.z.string().min(2),
    password: zod_1.z.string().min(2),
});
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const todoSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    done: Boolean,
    userId: String,
});
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
const Todo = mongoose_1.default.model('Todo', todoSchema);
exports.Todo = Todo;
