import jwt from "jsonwebtoken"
import express, { Request, Response } from "express"
import { authenticateJwt, SECRET } from  "../middleware/";
import { User, UserInterface, UserValidation } from "../db";
const router = express.Router();

  router.post('/signup', async (req, res) => {
    try {
      const body = UserValidation.parse(req.body);
      const username = body.username;
      const password = body.password
      const user: UserInterface | null = await User.findOne({ username });
      if (user) {
        res.status(403).json({ message: 'User already exists' });
      } else {
        const newUser = new User({ username, password });
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
      }
    } catch (error) {
        return res.status(400).json({ message: `User Validation Failed` });
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const body: UserInterface = UserValidation.parse(req.body);
      const username = body.username;
      const password = body.password
      const user = await User.findOne({ username, password });
      if (user) {
        const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
      } else {
        res.status(403).json({ message: 'Invalid username or password' });
      }
      
    } catch (error) {
      return res.status(400).json({ message: `User Validation Failed` });
    }
  });

    router.get('/me', authenticateJwt, async (req: Request, res: Response) => {
      const user = await User.findOne({ _id: req.headers.userId });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: 'User not logged in' });
      }
    });

export default router
