const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
require("dotenv").config();

const DB_LINK = process.env.DB_LINK;

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// mongoose schema

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  prices: Number,
  imageLink: String,
  published: Boolean,
});

// mongoose collection

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("User", adminSchema);
const Course = mongoose.model("User", courseSchema);

// connect to mongoDB
mongoose.connect(DB_LINK, { useNewUrlParse: true, useUnifiedTopology: true});

app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

const secretKey = "secR3T";

const generateToken = (user) => {
  const payload = { user: user.username };
  return jwt.sign(payload, secretKey);
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403).send(err);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(404);
  }
};

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (e) => e.username === username && e.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    const token = generateToken(admin);
    res.json({ message: "Admin signup successful", token });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    const token = generateToken(admin);
    res.json({ message: "Admin logged in successfully", token });
  } else {
    res.status(403).send({ message: "Admin login failed" });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  const course = req.body;
  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: " Course updated succesfully" });
  } else {
    res.status(400).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCourses: [] };
  const existingUser = USERS.find((a) => a.username === user.username);
  if (existingUser) {
    res.json({ message: "User already exists" });
  } else {
    USERS.push(user);
    const token = generateToken(user);
    res.json({ message: "User created successfull", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to login user
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = generateToken(user);
    res.json({ message: "User logged in succesfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id == courseId);
  if (course) {
    const user = USERS.find((u) => u.username === req.user.user);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      let purchasedCourses = user.purchasedCourses.push(course);
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => u.username === req.user.user);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: " No courses purchased" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port - ${PORT}`);
});
