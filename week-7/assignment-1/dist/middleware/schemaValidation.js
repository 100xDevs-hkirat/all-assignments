"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCredentialsSchemaValidation = exports.todoPostRequestSchemaValidation = void 0;
const zod_1 = require("zod");
const todoPostRequestSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
function todoPostRequestSchemaValidation(req, res, next) {
    try {
        todoPostRequestSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "Incorrect use of datatypes in the request body" });
    }
}
exports.todoPostRequestSchemaValidation = todoPostRequestSchemaValidation;
const userCredentialsSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
function userCredentialsSchemaValidation(req, res, next) {
    try {
        userCredentialsSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "Incorrect use of datatypes in the request body" });
    }
}
exports.userCredentialsSchemaValidation = userCredentialsSchemaValidation;
