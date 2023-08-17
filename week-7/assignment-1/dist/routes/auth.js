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
const middleware_1 = require("../middleware/");
const db_1 = require("../db");
const zod_1 = require("zod");
const router = express_1.default.Router();
const emailSchema = zod_1.z.string().email("Invalid email format");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password should be atleast 8 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/u, "Must contain letters and numbers");
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const validEmail = emailSchema.parse(username);
        const validPassword = passwordSchema.parse(password);
        const user = yield db_1.User.findOne({ validEmail });
        if (user) {
            res.status(403).json({ message: "User already exists" });
        }
        else {
            const newUser = new db_1.User({ validEmail, validPassword });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: "1h" });
            res.json({ message: "User created successfully", token });
        }
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            const errorMessage = e.errors[0].message;
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(400).json({ message: "Signup failed" });
        }
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: "1h" });
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
router.get("/me", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.User.findOne({ _id: req.headers["userId"] });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.status(403).json({ message: "User not logged in" });
    }
}));
exports.default = router;
