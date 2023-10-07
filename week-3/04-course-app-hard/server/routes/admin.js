const express = require('express');
const router = express.Router();
const {Admin, Courses} = require('../db/index')
const {authenticateJwtAdmin} = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const path = require('path');
const envFile = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({path: envFile});

const generateTokenForAdmin = (username) => {
    const data = { username };
    return jwt.sign(data, process.env.JWT_SECRET_KEY_ADMIN, {expiresIn: '1h'});
}  

router.post('/signup', async (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const pass = req.body.pass;
  const existingAdmin = await Admin.findOne({username, password:pass});
  console.log(existingAdmin);
  if(existingAdmin) {
    res.json({message: "User Already exist"});
  }
  else {
    const admin = new Admin({
      username: username,
      password: pass
    });
    const jwtToken = generateTokenForAdmin(username); 
    admin.save();
    res.json({message:"Admin Sign Up Successfully", jwtToken});
  }
});

router.post('/login', async (req, res) => {
    // logic to log in admin
    const username = req.header("username");
    const pass = req.header("pass");
    const admin = await Admin.findOne({username, password:pass});
    if(admin) {
        const jwtToken = generateTokenForAdmin(username);
        res.json({ message: 'Logged in successfully', jwtToken });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.post('/courses', authenticateJwtAdmin, (req, res) => {
    // logic to create a course
    const newCourse = req.body;
    //newCourse.id = Courses.length + 1;
    const course = new Courses(newCourse)
    course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
});

router.put('/courses/:courseId', async (req, res) => {
    // logic to edit a course
    const course = await Courses.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    console.log(course);
    if (course) {
        res.json({ message: 'Course updated successfully' });
        } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/courses', async (req, res) => {
    // logic to get all courses
    const courses = await Courses.find({});
    res.json({allCourses: courses})
});

module.exports = router
