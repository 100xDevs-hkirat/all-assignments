// const jwt = require("jsonwebtoken");
// const express = require('express');
// const { authenticateJwt, SECRET } = require("../middleware/");
// const { User } = require("../db");
import express from "express";
import jwt from "jsonwebtoken";
import { authenticateJwt, SECRET } from "../middleware/index";
import { User } from "../db/index";
import { IRequest } from "../interfaces/IRequest";
import { IResponse } from "../interfaces/IResponse";

const router = express.Router();

interface Request_User extends Request {
  userId?: string;
}

router.post("/signup", async (req: IRequest, res: IResponse) => {
  const { username, password } = req.body;
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

router.post("/login", async (req: IRequest, res: IResponse) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJwt, async (req: IRequest, res: IResponse) => {
  const user = await User.findOne({ _id: req.userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

// module.exports = router
export { router as authRouter };
