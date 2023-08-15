const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
// const { Admin } = require("mongodb");
const mongoose = require("mongoose");
const cors = require('cors');

app.use(express.json());
app.use(cors())

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

const secretKey = 's3c38S6ing';

function jwtAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(403);
  }
}

const adminSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  published: Boolean,
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose.connect(
  "mongodb+srv://bharath:bharath123@cluster0.l3ykpe4.mongodb.net/courses",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

// Admin routes

// logic to sign up admin
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "user already exists" });
  } else {
    const obj = {
      username,
      password,
    };
    const newAdmin = new Admin(obj);
    await newAdmin.save();
    const token = jwt.sign({ username, role: "Admin" }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "New user created", token });
  }
});

// logic to log in admin
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.find({ username, password });

  if (admin) {
    const token = jwt.sign({ username, role: "Admin" }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "logined in successfully", token });
  }
});

// logic to create a course
app.post("/admin/courses", jwtAuthentication, async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(200)
    .json({ message: "New course created succesfully", course: newCourse });
});

// logic to edit a course
app.put("/admin/courses/:courseId", jwtAuthentication, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (updatedCourse) {
      res
        .status(201)
        .json({
          message: "course updated successfully",
          course: updatedCourse,
        });
    } else {
      res.status(404).send("course not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// logic to get all courses
app.get("/admin/courses", jwtAuthentication, async (req, res) => {
  try {
    const course = await Course.find();
    res.status(200).json({ courses: course });
  } catch (error) {
    res.status(500).json(error);
  }
});

// User routes
// logic to sign up user
app.post("/users/signup", async(req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if(user){
    res.status(403).send("user already exists");
  }else{
    const obj = {
      username, password
    }
    const newUser = new User({username, password});
    await newUser.save();
    const token = jwt.sign({username, role: 'User'}, secretKey,{expiresIn: '1h'});
    res.status(201).json({message: 'new user created succesfully', token});
  }

  
});

// logic to log in user
app.post("/users/login", async (req, res) => {
  const {username, password} = req.headers;

  if(username && password) {
    const user = await User.findOne({username , password});
    if(user){
      const token = jwt.sign({username, role:'User'},secretKey, {expiresIn: '1h'});
      res.status(200).json({message: 'user logged in succssfuly', token});
    }
  }else{
    res.status(403).json({message: 'enter username and password'});
  }
});


// logic to list all courses
app.get("/users/courses", jwtAuthentication,async(req, res) => {
  const courses = await Course.find({});
  res.json({courses});
});

// logic to purchase a course
app.post("/users/courses/:courseId", jwtAuthentication, async(req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course)
  if(course){
    const user = await User.findOne({username: req.user.username});
    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.status(200).json({message:'course purchased succesfully'});
  }else{
    res.status(403).send('no user found');
  }
  }else{
    res.status(404).send('no course found')
  }
});

// logic to view purchased courses
app.get("/users/purchasedCourses",jwtAuthentication,async (req, res) => {
  const user = await User.findOne({username: req.user.username, password: req.user.password}).populate('purchasedCourses');

  if(user){
    const purchasedCourses = user.purchasedCourses;
    res.status(200).json({purchasedCourses});
  }else{
    res.status(404).send('no user found')
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
