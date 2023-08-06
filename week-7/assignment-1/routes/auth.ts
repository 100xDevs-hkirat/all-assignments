import jwt, { JwtPayload } from "jsonwebtoken";
import express, { Request, Response } from "express";
import { authenticateJwt } from "../middleware/";
import config from "../config";
import { InputUser, UserMe, UserToken } from "../types";
import { User } from "../db";
import { z } from "zod";
const router = express.Router();

const ZodInputUser = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});

router.post("/signup", async (req: Request, res: Response) => {
  const parsedInput = ZodInputUser.safeParse(req.body);
  if (!parsedInput.success) {
    const ans: UserToken = { message: JSON.stringify(parsedInput.error) };
    return res.status(411).json(ans);
  }
  const input: InputUser = parsedInput.data;
  const user = await User.findOne({ username: input.username });
  if (user) {
    const ans: UserToken = { message: "User already exists" };
    res.status(403).json(ans);
  } else {
    const newUser = new User({
      username: input.username,
      password: input.password,
    });
    await newUser.save();
    const pl: JwtPayload = { id: newUser._id };
    const token: string = jwt.sign(pl, config.SECRET, { expiresIn: "1h" });
    const ans: UserToken = { message: "User created successfully", token };
    res.json(ans);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const parsedInput = ZodInputUser.safeParse(req.body);
  if (!parsedInput.success) {
    const ans: UserToken = { message: JSON.stringify(parsedInput.error) };
    return res.status(411).json(ans);
  }
  const input: InputUser = parsedInput.data;
  const user = await User.findOne({ username: input.username });
  if (user) {
    const pl: JwtPayload = { id: user._id };
    const token: string = jwt.sign(pl, config.SECRET, { expiresIn: "1h" });
    const ans: UserToken = { message: "Logged in successfully", token };
    res.json(ans);
  } else {
    const ans: UserToken = { message: "Invalid username or password" };
    res.status(403).json(ans);
  }
});

router.get("/me", authenticateJwt, async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.headers["userId"] });
  if (user) {
    const ans: UserMe = { username: user.username };
    res.json(ans);
  } else {
    const ans: UserMe = { message: "User not logged in" };
    res.status(403).json(ans);
  }
});

export default router;
