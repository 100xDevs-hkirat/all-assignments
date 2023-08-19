"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = 'SECr3t'; // This should be in an environment variable in a real application
exports.SECRET = SECRET;
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!user) {
                return res.sendStatus(403);
            }
            if (typeof user === "string") {
                return res.sendStatus(403);
            }
            req.headers["userId"] = user.id;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
