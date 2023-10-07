import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";
import { authUserPass, handleValidation } from "./helper";
import { z } from "zod";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const parsedInputs = authUserPass.safeParse(req.body);

  if (!parsedInputs.success) {
    handleValidation(parsedInputs, res);
    return;
  }

  const { username, password } = parsedInputs.data;

  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const parsedInputs = authUserPass.safeParse(req.body);

  if (!parsedInputs.success) {
    handleValidation(parsedInputs, res);
    return;
  }

  const { username, password } = parsedInputs.data;

  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  const userId = z.string().min(1).safeParse(req.headers.userId);

  if (!userId.success) {
    handleValidation(userId, res);
    return;
  }

  const user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

export default router;
