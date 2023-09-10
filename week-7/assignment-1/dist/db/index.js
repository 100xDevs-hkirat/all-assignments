"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.User = void 0;
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    done: Boolean,
    userId: String,
});
exports.User = mongoose.model('User', userSchema);
exports.Todo = mongoose.model('Todo', todoSchema);
