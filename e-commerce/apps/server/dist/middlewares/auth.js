"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    console.log("Jwt secret missing");
    process.exit(1);
}
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // console.log(decoded);
        req.username = decoded.username;
        // console.log((req as any).username, decoded.user);
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.default = auth;
