import express, { Router, Request, Response } from "express";
import { register, login } from "../controllers/auth";
import User from "../models/User";
import authMiddleware from "../middlewares/auth";

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/me", authMiddleware, async (req: Request, res: Response) => {
    // console.log(req, req.user, req.username)
  const user = (req as any).username;
  res.json({ username: user });
});

export default router;
