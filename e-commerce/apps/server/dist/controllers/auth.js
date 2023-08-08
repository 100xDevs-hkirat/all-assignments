"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_1 = require("../services/auth");
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: "Missing username or password" });
        return;
    }
    try {
        const token = await (0, auth_1.register)(username, password);
        res.status(200).json(token);
    }
    catch (e) {
        res.status(401).json({ message: e.message });
    }
};
exports.register = register;
const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).json({ message: "Missing username or password" });
        return;
    }
    try {
        const user = User_1.default.findOne({ username, password });
        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }
        const token = (0, auth_1.genToken)(username);
        console.log({ token });
        res.status(200).json(token);
    }
    catch (e) {
        console.error("Error during login:", e);
        res.status(500).json({ msg: "Login failed" });
    }
};
exports.login = login;
