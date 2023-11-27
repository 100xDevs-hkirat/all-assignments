const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "zahid-secret-key";

// generate jwt for admin
const generateJwtAdmin = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// generate jwt for user
const generateJwtUser = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// middleware for admin routes
const authenticateJwtAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else res.sendStatus(401);
};

// middleware for user routes
const authenticateJwtUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else res.sendStatus(401);
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (existingAdmin) res.status(403).json({ message: "Admin already exist" });
  else {
    ADMINS.push(admin);
    const token = generateJwtAdmin(admin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    const token = generateJwtAdmin(admin);
    res.json({ message: "Logged in successfully", token });
  } else res.status(403).json({ message: "Admin authentication failed" });
});

app.post("/admin/courses", authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;
  COURSES.push({ ...course, id: COURSES.length + 1 });
  res.json({
    message: "Course created successfully",
    courseID: COURSES.length + 1,
  });
});

app.put("/admin/courses/:courseId", authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  const courseID = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex((c) => c.id === courseID);
  if (courseID > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: "Course updated successfully" });
  } else res.status(404).json({ message: "Course not found" });
});

app.get("/admin/courses", authenticateJwtAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find((u) => u.username === user.username);
  if (existingUser) res.status(403).json({ message: "User already exists" });
  else {
    USERS.push(user);
    const token = generateJwtUser(user);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = generateJwtUser(user);
    res.json({ message: "Logged in seccessfully", token });
  } else res.status(403).json({ message: "User authentication failed" });
});

app.get("/users/courses", authenticateJwtUser, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateJwtUser, (req, res) => {
  // logic to purchase a course
  const courseID = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseID);
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) user.purchasedCourses = [];
      user.purchasedCourses.push(course);
      res.json({ message: "Course purchases successfully" });
    } else res.status(403).json({ message: "User not found" });
  } else res.status(404).json({ message: "Course not found" });
});

app.get("/users/purchasedCourses", authenticateJwtUser, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => u.username === req.user.username);
  if (user) res.json({ purchasedCourses: user.purchasedCourses });
  else res.status(404).json({ message: "No course purchased" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
