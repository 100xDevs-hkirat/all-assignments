require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const secret = process.env.SECRET_KEY;

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  if (ADMINS.some((currentAdmin) => currentAdmin.username === username)) {
    res.status(500).json({ error: "Admin already exists." });
  }
  ADMINS.push({ username, password });
  const token = jwt.sign({ username, role: "admin" }, secret, {
    expiresIn: "1h",
  });
  res.json({ message: "Admin created successfully", token });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const user = req.headers;
  if (
    !ADMINS.some(
      (currentAdmin) =>
        currentAdmin.username == user.username &&
        currentAdmin.password == user.password
    )
  ) {
    res.status(422).json({ error: "Admin doesn't exists" });
  }
  const token = jwt.sign({ username: user.username, role: "admin" }, secret, {
    expiresIn: "1h",
  });
  res.json({ message: "Logged in successfully", token });
});

app.post("/admin/courses", adminAuthenticateJWT, (req, res) => {
  // logic to create a course
  let course = req.body;
  const id = Date.now();
  course.id = id;
  COURSES.push(course);
  res.status(201).json({ message: "Course created successfully", id });
});

app.put("/admin/courses/:courseId", adminAuthenticateJWT, (req, res) => {
  // logic to edit a course
  const id = req.params.courseId;
  let course = COURSES.find((course) => course.id == id);
  if (!course) {
    res.status(500).json({ error: `Course with id-${id} not found.` });
  }
  Object.assign(course, req.body);
  res.json({ message: "Course updated successfully" });
});

app.get("/admin/courses", adminAuthenticateJWT, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  if (USERS.some((currentAdmin) => currentAdmin.username === username)) {
    res.status(500).json({ error: "User already exists." });
  }
  USERS.push({ username, password, purchasedCourses: [] });
  console.log(USERS);
  const token = jwt.sign({ username, role: "user" }, secret, {
    expiresIn: "1h",
  });
  res.json({ message: "User created successfully", token });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const user = req.headers;
  if (
    !USERS.some(
      (currUser) =>
        user.username == currUser.username && user.password == currUser.password
    )
  ) {
    res.status(500).json({ error: "User doesn't exists" });
  }
  const token = jwt.sign({ username: user.username, role: "user" }, secret, {
    expiresIn: "1h",
  });
  res.json({ message: "Logged in successfully", token });
});

app.get("/users/courses", userAuthenticateJWT, (req, res) => {
  const courses = COURSES.filter((course) => course.published);
  res.json({ courses });
});

app.post("/users/courses/:courseId", userAuthenticateJWT, (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const user = USERS.find((user) => user.username == req.user.username);
  const course = COURSES.find(
    (course) => course.id == courseId && course.published
  );
  console.log(user);
  if (!course) {
    res.status(500).json({ err: "Course not found." });
  }
  user.purchasedCourses.push(course);
  res.json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", userAuthenticateJWT, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((user) => user.username == req.user.username);
  const purchasedCourses = user.purchasedCourses;
  res.json({ purchasedCourses });
});

function adminAuthenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Authorization Token is missing" });
  }
  jwt.verify(token, secret, (err, admin) => {
    if (err || admin.role != "admin") {
      res.status(401).json({ error: "Admin no longer exists." });
    }
    next();
  });
}

function userAuthenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Authorization Token is missing" });
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.status(401).json({ error: "User no longer exists." });
    }
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
