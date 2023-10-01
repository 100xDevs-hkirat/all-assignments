"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.SECRET = void 0;
// const jwt = require('jsonwebtoken');
// const { Response } = require('express');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET = "SECr3t"; // This should be in an environment variable in a real application
//icould also use the extended property of interface to introduce one more property userId
//but for now i am storing userId in headers
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            // req.userId = user.id;
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
