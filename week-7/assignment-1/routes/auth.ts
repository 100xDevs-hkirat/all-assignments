import jwt from 'jsonwebtoken'
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";
import {z} from 'zod';
const router = express.Router();

type userType ={
  username:string;
  password:string;
}

const zodUserInputSchema = z.object({
  username: z.string().min(5).max(50),
  password: z.string().min(6)
})

  router.post('/signup', async (req, res) => {
    try{
      const {username, password}: userType = zodUserInputSchema.parse(req.body);
      const user = await User.findOne({username});
      if (user) {
        res.status(403).json({message: 'User already exists'});
      } else {
        const newUser = new User({username, password});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: '1h'});
        res.json({message: 'User created successfully', token});
      }
    }
    catch (e) {
      res.status(400).json({ error: e });
    }
  });
  
  router.post('/login', async (req, res) => {
    try{
      const {username, password}: userType = zodUserInputSchema.parse(req.body);
      const user = await User.findOne({username, password});
      if (user) {
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: '1h'});
        res.json({message: 'Logged in successfully', token});
      } else {
        res.status(403).json({message: 'Invalid username or password'});
      }
    }
    catch (e) {
      res.status(400).json({ error: e });
    }
  });

    router.get('/me', authenticateJwt, async (req, res) => {
      const userId = req.headers["userId"];
      const user = await User.findOne({ _id: userId });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: 'User not logged in' });
      }
    });

  export default router;
