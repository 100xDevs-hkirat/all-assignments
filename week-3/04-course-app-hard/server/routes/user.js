const express = require('express');
const router = express.Router();
const {Users, Courses} = require('../db/index')
const {authenticateJwtUser} = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const path = require('path');
const envFile = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({path: envFile});

const generateTokenForUser = (username) => {
    const data = {username};
    return jwt.sign(data, process.env.JWT_SECRET_KEY_USER, {expiresIn: '1h'});
}
  
router.post('/signup', async (req, res) => {
    // logic to sign up user
    const username = req.body.username;
    const password = req.body.pass;
    const existingUser = await Users.findOne({username:username, password:password});
    if(existingUser) {
        res.json({message: 'User Already present'});
    }
    else {
        const user = new Users({
        username:username,
        password:password
        });
        const jwtToken = generateTokenForUser(username); 
        user.save();
        res.json({message:"User Signup Successfully", token: jwtToken});
    }
});
  
router.post('/login', async (req, res) => {
    // logic to log in user
    const username = req.header("username");
    const password = req.header("pass");
    const user = await Users.findOne({username, password});
    if(user) {
      const jwtToken = generateTokenForUser(username);
      res.json({message:"User Logged In successfully", token: jwtToken})
    }
    else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
});
  
router.get('/courses', authenticateJwtUser, async (req, res) => {
    // logic to list all courses
    const courses = await Courses.find({published:true});
    res.json({courses});  
});
  
router.post('/courses/:courseId', authenticateJwtUser, async (req, res) => {
    // logic to purchase a course
    const courseId = req.params.courseId;
    const course = await Courses.findById(courseId);    
    if(course) {
        const user = await Users.findOne({username: req.user.username});
        if(user) {
        const existingCourse = await Users.findOne({
            username: req.user.username,
            coursesPurchased: { $in: [courseId] }
        }).exec();
        if(existingCourse) {
            res.status(403).json({message: 'Course already purchased'});
        }
        else {
            user.coursesPurchased.push(course);
            await user.save();
            res.json({ message: 'Course purchased successfully' });
        }
        }
        else {
        res.status(403).json({ message: 'User not found' });
        }
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
});
  
router.get('/purchasedCourses', authenticateJwtUser, async (req, res) => {
    // logic to view purchased courses
    const user = await Users.findOne({ username: req.user.username }).populate('coursesPurchased');
    if (user) {
        res.json({ coursesPurchased: user.coursesPurchased || [] });
    } else {
        res.status(403).json({ message: 'User not found' });
    }
});

  
module.exports = router;