"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const port = 3000;
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const cors = require('cors');
app.use(cors());
app.use(express_1.default.json());
app.use('/auth', authRoutes);
app.use('/todo', todoRoutes);
app.listen(port, () => {
    console.log('listening on port ' + port);
});
mongoose_1.default.connect('mongodb://127.0.0.1:27017/courses');
