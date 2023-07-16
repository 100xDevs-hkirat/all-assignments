const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const secret = "jbkjsdbkjf";

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
  purchasedCourses: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number, 
  imageLink: String,
  purchased: Boolean
})

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

mongoose.connect("mongodb+srv://shivammessi07:a6Vh2kZZG9lWCNqJ@cluster0.gzsvjbu.mongodb.net/")

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;

  function callback(admin){
    if(admin){
      res.status(403).json({messege: "Admin already exists"});
    }else{
      const obj = {username: username, password: password};
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '1h' });
      res.json({messege: "Admin created successfully"});
    }
  }
  Admin.findOne({ username }).then(callback);
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = await Admin.findOne({username, password});
  if(admin){
    const token = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '1h' });
    res.json({messege: "Logged in successfully", token});
  }else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({messege: "Courses added", courseId: course.id});
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
  if(course){
    res.json({messege: "Course updated successfully"});
  }else {
    res.status(404).json({messege: "Course not found"});
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.send({courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, secret, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async(req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = await User.findOne({username, password});
  if(user){
    const token = jwt.sign({ username, role: 'user' }, secret, { expiresIn: '1h' });
    res.json({messege: "Logged in successfully", token});
  }else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async(req, res) => {
  // logic to list all courses
  const courses = await Course.find({published: true});
  res.send({courses});
});

app.post('/users/courses/:courseId', authenticateJwt, async(req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if(course){
    const user = await User.findOne({username: req.user.username});
    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.json({messege: "Course purchased successfully"})
    }else{
      res.status(403).json({messege: "User not found"})
    }
  }else{
    res.status(404).json({messege: "Course not found"});
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async(req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
