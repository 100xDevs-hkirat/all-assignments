import jwt from "jsonwebtoken";
import express from "express";
import {z} from "zod";
import { authenticateJwt, SECRET } from "../middleware/index";
import { User } from "../db";
const router = express.Router();

const UserBody = z.object({
  username: z.string({
    required_error: "Email is required",
  })
  .email("Not a valid email"),
  password: z.string({required_error:"Password is required"}).min(3).max(10)
})

  router.post('/signup', async (req, res) => {
    const result = UserBody.safeParse(req.body);
    if(!result.success) {
      let message = ""
      result.error.issues.forEach((error) => {
        message = message + error.message + " for " + error.path + "\n";
      })
      res.status(400).json({message});
      return
    }
    const { username, password }= UserBody.parse(req.body);
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const result = UserBody.safeParse(req.body);
    if(!result.success) {
      let message = ""
      result.error.issues.forEach((error) => {
        message = message + error.message + " for " + error.path + "\n";
      })
      res.status(400).json({message});
      return
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

    router.get('/me', authenticateJwt, async (req, res) => {
      const user = await User.findOne({ _id: req.headers["userId"] });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: 'User not logged in' });
      }
    });

  export default router
