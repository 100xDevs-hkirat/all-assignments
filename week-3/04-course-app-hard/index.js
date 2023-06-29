const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User  = require('./models/UserModel');
const Admin  = require('./models/AdminModel');
const Course  = require('./models/CourseModel');

const JWT_SECRET = 'This is my JWT SECRET'

const app = express();
const connect = async () => {
  const dbUri = 'mongodb://notadmin:notpassword@localhost:27017'
  try {
      await mongoose.connect(dbUri);
      console.log('Connected to the DB');
  } catch (e) {
      console.error('Error connecting to the DB');
      process.exit(1);
  }
}

app.use(express.json());

const generateToken = (username) => {
  const token = jwt.sign({ username: username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(403).json({
        error: 'Please provide an authentication header!',
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        error: 'Please provide a token!',
      });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.username = payload.username;
    next();
  } catch (e) {
    res.status(401).send("Please authenticate");
  }
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  try {
    let username = req.body.username;
    const admin = await Admin.findOne({ username: username });
    if (admin) return res.status(400).json({ error: 'Admin already exists' });
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password,
    });
    await newAdmin.save();
    const token = generateToken(username);
    res.status(201).json({
      message: "Admin created successfully",
      token: token,
    });
  } catch (error) {
    console.error('Error signing up admin', error);
    res.sendStatus(500);
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  try {
    let username = req.body.username;
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) return res.status(400).json({ error: 'Admin not found' });
    let isPasswordValid = false;
    if(admin.password === req.body.password) isPasswordValid = true;
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
    else {
      const token = generateToken(username);
      res.status(200).json({
        message: 'Logged in successfully',
        token: token
      });
    }
  } catch (error) {
    console.error('Error logging in admin', error);
    res.sendStatus(500);
  }
});

app.post('/admin/courses', verifyToken, async (req, res) => {
  // logic to create a course
  try {
    const existingCourse = await Course.findOne({ title: req.body.title });
    if (existingCourse) {
      return res.status(400).json({
        error: 'Course already exists',
      });
    } else {
      const newCourse = new Course({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageLink: req.body.imageLink,
        published: req.body.published,
      });
      await newCourse.save();
      res.status(200).json({
        message: 'Course created successfully',
      });
    }
  } catch(error) {
    console.error('Error creating a course', error);
    res.sendStatus(500);
  }
});

app.put('/admin/courses/:courseId', verifyToken, async (req, res) => {
  // logic to edit a course
  try {
    const courseId = req.params.courseId;
    const course = await Course.findOneAndUpdate(
      { _id: courseId }, 
      req.body, 
      { new: true } 
    );
    if (!course) {
      return res.status(404).json({
        error: "Course doesn't exist",
      });
    }
    res.status(200).json({
      message: 'Course updated successfully',
      course: course 
    });
  } catch(error) {
    console.error('Error creating a course', error);
    res.sendStatus(500);
  }
});

app.get('/admin/courses', verifyToken, async (req, res) => {
  // logic to get all courses
  try {
    const coursesToReturn = await Course.find();
    res.status(200).json({
      courses: coursesToReturn
    });
  } catch(error) {
    console.error('Error creating a course', error);
    res.sendStatus(500);
  }
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  try {
    let username = req.body.username;
    const user = await User.findOne({ username: username });
    if (user) return res.status(403).json({ error: 'User already exists' });
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await newUser.save();
    const token = generateToken(username);
    res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error('Error signing up user', error);
    res.sendStatus(500);
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  try {
    let username = req.body.username;
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    let isPasswordValid = false;
    if(user.password === req.body.password) isPasswordValid = true;
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
    else {
      const token = generateToken(username);
      res.status(200).json({
        message: 'Logged in successfully',
        token: token
      });
    }
  } catch (error) {
    console.error('Error logging in user', error);
    res.sendStatus(500);
  }
});

app.get('/users/courses',verifyToken, async (req, res) => {
  // logic to list all courses
  try {
    const coursesToReturn = await Course.find();
    res.status(200).json({
      courses: coursesToReturn
    });
  } catch(error) {
    console.error('Error creating a course', error);
    res.sendStatus(500);
  }
});

app.post('/users/courses/:courseId', verifyToken, async (req, res) => {
  // logic to purchase a course
  try {
    const courseId = req.params.courseId;
    const username = req.username;

    const user = await User.findOne({ username });
    const course = await Course.findById(courseId);
    const title = course.title;

    if (user.purchased_courses.includes(title)) {
      return res.status(400).json({
        error: 'Course already purchased',
      });
    }

    user.purchased_courses.push(title);
    await user.save();

    res.status(200).json({
      message: 'Course purchased successfully',
    });

  } catch(error) {
    console.error('Error creating a course', error);
    res.sendStatus(500);
  }
});

app.get('/users/purchasedCourses', verifyToken, async (req, res) => {
  // logic to view purchased courses
  try {
    const username = req.username;
    const user = await User.findOne({ username });
    const purchasedCourses = user.purchased_courses;
    res.status(200).json({
      courses: purchasedCourses
    })
  } catch (error) {
    console.error('Error getting courses', error);
    res.status(500).send(
      'Error getting courses'
    );
  }
});

app.listen(3000, async () => {
  await connect();
  console.log('Server is listening on port 3000');
});
