"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        yield prisma.user.create({
            data: {
                username,
                password,
            },
        });
        const user = yield prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, authenticate_1.SECRET, { expiresIn: "1h" });
            res.json({ message: "User created successfully.", token: token });
        }
        else {
            res.json({ error: "Error while creating the user." });
        }
    }
    catch (error) {
        res.json({ error: "Error while signup." });
        console.error("Error:", error);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                username,
                password,
            },
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, authenticate_1.SECRET, { expiresIn: "1h" });
            res.json({ message: "User login successfully.", token: token });
        }
        else {
            res.json({ error: "Failed to login." });
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
router.get("/me", authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.headers.userId, 10);
        if (!isNaN(userId)) {
            const user = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (user) {
                res.json({ user });
            }
        }
        else {
            res.json({ error: "Failed to get the data." });
            console.error("Not get the userId from the jwt.");
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}));
exports.default = router;
