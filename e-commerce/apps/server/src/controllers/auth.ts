import { Request, Response } from "express";
import { genToken, register as registerService } from "../services/auth";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ message: "Missing username or password" });
    return;
  }
  try {
    const token = await registerService(username, password);
    res.status(200).json(token);
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ message: "Missing username or password" });
    return;
  }
  try {
    const user = User.findOne({ username, password });
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    const token = genToken(username);
    console.log({ token });
    res.status(200).json({ token });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ msg: "Login failed" });
  }
};

// export const me = async (req: Request, res: Response) => {
//   const { username, password } = req.body;
//   if(!username || !password) {
//     res.status(401).json({ message: "Missing username or password" });
//     return;
//   }
//   try {
//     const user = await findOne()
//   } catch(e) {
//     console.error("Error /me:", e);
//     res.sendStatus(500);
//   }
// }
