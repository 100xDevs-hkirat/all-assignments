"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const express = require('express');
const cors_1 = __importDefault(require("cors"));
// const cors = require('cors');
const router_1 = __importDefault(require("./routes/auth.ts/router"));
const router_2 = __importDefault(require("./routes/todo.js/router"));
// const auth = require('./routes/auth');
// const todo = require('./routes/todo');
const app = (0, express_1.default)();
app.get('/', (req, res) => { });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', router_1.default);
app.use('/todo', router_2.default);
app.use("*", (req, res) => {
    res.status(404).json("hkd;");
});
// export default app;
module.exports = app;
