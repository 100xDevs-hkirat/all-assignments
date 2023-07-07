const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

//Define MongoDB schemas

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

//Defining mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

mongoose.connect(
  'mongodb+srv://amitalable:L0FmAENkzeZD1i5v@cluster0.cjmkesu.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const generateToken = (credentials) =>
  jwt.sign(credentials, 'S3cr3tK1Y', { expiresIn: '1h' });

// const verifyToken = (token) => jwt.verify(token, 'S3cr3tK1Y');

const validateLoginForAdmins = async (req, res, next) => {
  const { username, password } = req.headers;
  const existingAdmin = await Admin.findOne({ username, password });

  if (existingAdmin) {
    req.token = generateToken({ username, password });
    next();
  } else {
    return res.sendStatus(403);
  }
};

const validateLoginForUsers = async (req, res, next) => {
  const { username, password } = req.headers;
  const existingUser = await User.findOne({ username, password });

  if (existingUser) {
    req.token = generateToken({ username, password });
    next();
  } else {
    return res.sendStatus(403);
  }
};

const adminAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'S3cr3tK1Y', (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'S3cr3tK1Y', async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = await User.findOne({ username: user.username });
      if (req.user) {
        next();
      } else {
        return res.sendStatus(404);
      }
    });
  } else {
    return res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    return res.status(403).json({ message: 'Admins already exists' });
  } else {
    const credentials = { username, password };
    const token = generateToken(credentials);
    const newAdmin = new Admin(credentials);
    await newAdmin.save();
    return res.status(200).json({
      message: 'Admin created successfully',
      token
    });
  }
});

app.post('/admin/login', validateLoginForAdmins, (req, res) => {
  // logic to log in admin
  return res.status(200).json({
    message: 'Logged in success fully',
    token: req.token
  });
});

app.post('/admin/courses', adminAuthentication, async (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  const newCourse = new Course({
    title,
    description,
    price,
    imageLink,
    published
  });
  const course = await newCourse.save();

  return res
    .status(200)
    .json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuthentication, async (req, res) => {
  // logic to edit a course

  const { title, description, price, imageLink, published } = req.body;
  const courseId = req.params.courseId;
  const existingCourse = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true
  });

  if (existingCourse) {
    return res.status(200).json({ message: 'Course updated successfully' });
  }

  return res.status(404).json({ message: 'Course not found' });
});

app.get('/admin/courses', adminAuthentication, async (_req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  return res.status(200).json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user

  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res
      .status(403)
      .json({ message: 'Users already exists', existingUser });
  } else {
    const credentials = { username, password };
    const newUser = new User({ ...credentials, purchasedCourses: [] });
    await newUser.save();
    const token = generateToken(credentials);
    return res
      .status(200)
      .json({ message: 'Users created successfully', token });
  }
});

app.post('/users/login', validateLoginForUsers, (req, res) => {
  // logic to log in user
  return res
    .status(200)
    .json({ message: 'Logged in successfully', token: req.token });
});

app.get('/users/courses', userAuthentication, async (_req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  return res.status(200).json({ courses });
});

app.post('/users/courses/:courseId', userAuthentication, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (course) {
    req.user.purchasedCourses.push(course);
    await req.user.save();
    return res.json({ message: 'Course purchased successfully' });
  } else {
    return res
      .status(404)
      .json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, async (req, res) => {
  // logic to view purchased courses
  const users = (await req.user.populate('purchasedCourses')) || [];
  return res.json({ purchasedCourses: users.purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
