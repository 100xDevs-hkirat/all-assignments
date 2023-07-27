"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const express = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const todo_1 = require("./routes/todo");
const auth_1 = require("./routes/auth");
app.use(express_1.default.json());
mongoose_1.default.connect("mongodb://localhost:27017", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: "todos",
});
app.use("/todo", todo_1.todoRouter);
app.use("/auth", auth_1.authRouter);
app.listen(3000);
