"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require("express");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//const mongoose = require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
const port = 3000;
//const authRoutes = require("./routes/auth");
const auth_1 = __importDefault(require("./routes/auth"));
//const todoRoutes = require("./routes/todo");
const todo_1 = __importDefault(require("./routes/todo"));
//const cors = require("cors");
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/todo", todo_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
mongoose_1.default.connect('mongodb+srv://sujitdb:sujay1234@cluster0.opya8z3.mongodb.net/', { dbName: "todoall" });
