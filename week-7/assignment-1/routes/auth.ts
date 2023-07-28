import jwt from 'jsonwebtoken'
import express from 'express'
import { authenticateJwt , SECRET } from '../middleware';
import { Username, Password } from '../validation/input';
import { UserType } from '../validation/types'; 
import { User } from "../db";

const router = express.Router();

  router.post('/signup', async (req, res) => {
    const userInput: UserType = req.body;

    const isUsernameValid = Username.safeParse(userInput.username);
    const isPasswordValid = Password.safeParse(userInput.password);
    
    console.log(isUsernameValid.success , isPasswordValid.success)
    if (!isUsernameValid.success || !isPasswordValid.success) { 
      return res.status(403).json({
        message: 'improper username or password'
      });  
    }

    const user = await User.findOne({ username: userInput.username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ 
        username: userInput.username,
        password: userInput.password 
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }

  });
  
  router.post('/login', async (req, res) => {
    const userInput: UserType = req.body;
    const user = await User.findOne({ 
      username: userInput.username,
      password: userInput.password 
    });
    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

    router.get('/me', authenticateJwt, async (req, res) => {
      const user = await User.findOne({ _id: req.headers.userId });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: 'User not logged in' });
      }
    });

  module.exports = router
