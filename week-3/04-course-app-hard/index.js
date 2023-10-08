const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const secret = "seCRET12432";

//Define mongoose schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: []
});

const coursesSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

//Define mongoose model
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Courses = mongoose.model("Courses", coursesSchema);

//mongodb connection string
mongoose.connect('mongodb+srv://atinder007:QguoeT36MPkZQ9FH@cluster0.ap2renn.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true });

const authenticateJWT = (req,res,next) => {
  const auth = req.headers.authorization;

  if(auth) {
    const token = auth.split(' ')[1];
    jwt.verify(token, secret, (err, data) => {
      if (err) return res.status(403).json({message: "User session expired"});

      req.user = data;
      next();
    })
  } else {
    return res.status(403).json({message: "User session expired"});
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password} = req.body;
  const admin = await Admin.findOne({username});
  if(admin) {
    res.status(403).json({message: "Admin already exists"});
  } else {
    const newAdmin = new Admin({username, password});
    await newAdmin.save();
    res.json({message: "Admin created successfully"});
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if(admin) {
    // generate token
    const payload = { username: username, role: "Admin"};
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
    res.json({message: "Login successful", token});
  } else {
    res.status(401).json({message: "Invalid username or password"});
  }
});

app.post('/admin/courses', authenticateJWT, async (req, res) => {
  const course = req.body;
  const exists = await Courses.findOne({ title: course.title });
  if(exists) {
    res.status(403).json({message: "Course title already exists"});
  } else {
    const newcourse = new Courses(course);
    await newcourse.save();
    res.json({message: "Course created successfully"});
  }
});

app.put('/admin/courses/:courseId', authenticateJWT, async (req, res) => {
  const courseId = req.params.courseId;
  const course = req.body;

  const updated = await Courses.findByIdAndUpdate(courseId, course, { new: true });
  if (updated) {
    res.json({message: "Course updated successfully"});
  } else {
    res.status(404).json({message: "Course not found"});
  }
});

app.get('/admin/courses', authenticateJWT, async (req, res) => {
  // logic to get all courses
  const courses = await Courses.find({});
  res.json({courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if(user) {
    res.status(403).json({message: "User already exists"});
  } else {
    const newuser = new User({ username, password});
    await newuser.save();
    res.json({message: "User added successfully"});
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;

  const user = await User.findOne({ username, password});
  if(user) {
    const payload = { username: username, role: "User"};
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
    res.json({message: "Login successful", token});
  } else {
    res.status(401).json({message: "Invalid username or password"});
  }
});

app.get('/users/courses', authenticateJWT, async (req, res) => {
  // logic to list all courses
  const courses = await Courses.find({ published: true });
  res.json({courses: courses});
});

app.post('/users/courses/:courseId', authenticateJWT, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;

  const course = await Courses.findById(courseId);
  if(course) {
    const username = req.user.username;
    const user = await User.findOne({username});

    if(user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({message: "Course purchase successful"});
    } else {
      res.status(403).json({message: "User not found"});
    }
  } else {
    res.status(404).json({message: "Course not found to purchase"});
  }
});

app.get('/users/purchasedCourses', authenticateJWT, async (req, res) => {
  const user = await User.findOne({username: req.user.username});
  if(user) {
    res.json({PurchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({message: "User not found"});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
