const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mongooseUri = `mongodb+srv://admin-akash:220104008@cluster0.kcycili.mongodb.net/courses`
const ADMIN_SECRET_KEY = "2003";
const USER_SECRET_KEY = "2018";
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

mongoose.connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: {type: String},
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

// Define mongoose models
const User = mongoose.model('Course_User', userSchema);
const Admin = mongoose.model('Course_Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

// Helper
const adminAuth = (req, res, next) => {
  let {authorization} = req.headers;
  if(!authorization) {
    return res.status(401).json({message: "Unauthorized!"});
  }
  if(authorization.startsWith("Bearer")) {
    authorization = authorization.split(" ")[1];
  }
  const decoded = jwt.verify(authorization, ADMIN_SECRET_KEY, (err, decoded) => {
    if(err) {
      return res.status(403).json({message: "Forbidden!"});
    }
    return decoded;
  });
  req.admin = decoded;
  next();
}
const userAuth = (req, res, next) => {
  let {authorization} = req.headers;
  if(!authorization) {
    return res.status(401).json({message: "Unauthorized!"});
  }
  if(authorization.startsWith("Bearer")) {
    authorization = authorization.split(" ")[1];
  }
  const decoded = jwt.verify(authorization, USER_SECRET_KEY, (err, decoded) => {
    if(err) {
      return res.status(403).json({message: "Forbidden!"});
    }
    return decoded;
  });
  req.user = decoded;
  next();
}

const editCourse = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if(!course || course == {}) {
    return 0;
  }
  if (body.title != '' || body.title != undefined) {
    course.title = body.title;
  }
  if (body.description != '' || body.description != undefined) {
    course.description = body.description;
  }
  if (body.price != '' || body.price != undefined) {
    course.price = body.price;
  }
  if (body.imageLink != '' || body.imageLink != undefined) {
    course.imageLink = body.imageLink;
  }
  if (body.published != '' || body.published != undefined) {
    course.published = body.published;
  }
  await course.save();
  return 1;
    
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == "") {
    return res.status(400).json({message: "Bad request :("});
  }
  const admin = await Admin.findOne({username});
  if(admin) {
    return res.status(403).json({message: "username exists :)"});
  }
  const object = new Admin({username, password});
  await object.save();
  const token = jwt.sign({username, id: object.id}, ADMIN_SECRET_KEY);
  return res.status(200).json({message: 'Admin created successfully', token});
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  if(!username || username == '' || !password || password == "") {
    return res.status(400).json({message: "Bad request :("});
  }
  const isAdmin = await Admin.findOne({username});
  if(!isAdmin || isAdmin == {}) {
    return res.status(404).json({message: "No such user"});
  }
  if(isAdmin.password !== password) {
    return res.status(400).json({message: "Password Error :("});
  }
  const token = jwt.sign({username, id: isAdmin.id}, ADMIN_SECRET_KEY);
  return res.status(200).json({message: "Logged in successfully", token});
});

app.post('/admin/courses', adminAuth, async (req, res) => {
  // logic to create a course
  const body = req.body;
  const course = new Course({...body});
  await course.save();
  return res.status(200).json({message: 'Course created successfully', courseId: course.id});
});

app.put('/admin/courses/:courseId', adminAuth, async (req, res) => {
  // logic to edit a course
  const body = req.body;
  const {courseId} = req.params;
  const isUpdate = await editCourse(courseId, body);
  if(!isUpdate) {
    return res.status(400).json({message: "Invalid params"});
  }
  return res.status(200).json({message: 'Course updated successfully'});
});

app.get('/admin/courses', adminAuth, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find();
  return res.status(200).json({courses})
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == "") {
    return res.status(400).json({message: "Bad request :("});
  }
  const user = await User.findOne({username});
  if(user) {
    return res.status(403).json({message: "username exists :)"});
  }
  const object = new User({username, password});
  await object.save();
  const token = jwt.sign({username, id: object.id}, USER_SECRET_KEY);
  return res.status(200).json({message: 'User created successfully', token});
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  if(!username || username == '' || !password || password == "") {
    return res.status(400).json({message: "Bad request :("});
  }
  const isUser = await User.findOne({username});
  if(!isUser || isUser == {}) {
    return res.status(404).json({message: "No such user"});
  }
  if(isUser.password !== password) {
    return res.status(400).json({message: "Password Error :("});
  }
  const token = jwt.sign({username, id: isUser.id}, USER_SECRET_KEY);
  return res.status(200).json({message: "Logged in successfully", token});
});

app.get('/users/courses', userAuth, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({published: true});
  if(!courses || courses == {}) {
    return res.status(500).json({message: "Internal Server Error"});
  }
  return res.status(200).json({courses});
});

app.post('/users/courses/:courseId', userAuth, async (req, res) => {
  // logic to purchase a course
  const {courseId} = req.params;
  const user = req.user;
  const userData = await User.findById(user.id);
  const course = await Course.findById(courseId);
  if(!course || course == {}) {
    return res.status(400).json({message: "Invalid Params"});
  }
  // Check for Transcations
  userData.purchasedCourses.push(course);
  await userData.save();
  return res.status(200).json({message: 'Course purchased successfully'});
});

app.get('/users/purchasedCourses', userAuth, async (req, res) => {
  // logic to view purchased courses
  const user = req.user;
  const data = await User.findById(user.id).populate('purchasedCourses');
  return res.status(200).json({purchasedCourses: data.purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
