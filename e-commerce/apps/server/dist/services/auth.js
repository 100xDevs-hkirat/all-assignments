"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.verifyToken = exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    console.log("Jwt secret missing");
    process.exit(1);
}
const genToken = (username) => {
    const payload = { username };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1hr' });
};
exports.genToken = genToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const register = async (username, password) => {
    const existingUser = await User_1.default.findOne({ username });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = new User_1.default({ username, password });
    await user.save();
    return { token: (0, exports.genToken)(username) };
};
exports.register = register;
