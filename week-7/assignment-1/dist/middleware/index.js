"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTodo = exports.authenticateJwt = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
exports.SECRET = 'SECr3t'; // This should be in an environment variable in a real application
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if ((user === undefined) || (typeof user === 'string')) {
                return res.sendStatus(403);
            }
            req.headers['userId'] = user.id;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
const TodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10)
});
const validateTodo = (req, res, next) => {
    const { title, description } = req.body;
    const validationResult = TodoSchema.safeParse({ title, description });
    if (validationResult.success === false) {
        const errorMessages = validationResult.error.errors.map((err) => {
            const fieldName = err.path.join('.');
            return `${fieldName} ${err.message}`;
        });
        return res.status(409).json({ error: 'Validation failed', details: errorMessages });
    }
    next();
};
exports.validateTodo = validateTodo;
