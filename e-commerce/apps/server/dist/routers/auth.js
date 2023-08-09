"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.post("/signup", auth_1.register);
router.post("/login", auth_1.login);
router.post("/me", auth_2.default, async (req, res) => {
    // console.log(req, req.user, req.username)
    const user = req.username;
    res.json({ username: user });
});
exports.default = router;
