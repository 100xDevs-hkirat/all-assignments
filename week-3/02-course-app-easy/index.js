const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//Middleware
const adminAuthentication = (req, res, next) => {
  let username = req.headers.username;
  let pass = req.headers.password;

  const existingAdmin = ADMINS.find((a) => a.username === username && a.password === pass);
  if (existingAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  let username = req.headers.username;
  let pass = req.headers.password;

  const existingUser = USERS.find((a) => a.username === username && a.password === pass);
  if (existingUser) {
    req.user = existingUser; // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  let newAdmin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === newAdmin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(newAdmin);
    res.status(201).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  res.status(201).json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  let courseDetails = req.body;
  let id = Math.floor(Math.random() * 100);
  courseDetails.id = id;
  COURSES.push(courseDetails);
  res.status(201).json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  let newCourseDetails = req.body;
  let courseId = parseInt(req.params.courseId);
  var existingCourseIndex = COURSES.findIndex((a) => a.id === courseId);
  if (existingCourseIndex >= 0) {
    newCourseDetails.id = COURSES[existingCourseIndex].id;
    COURSES[existingCourseIndex] = newCourseDetails;
    res.status(201).json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not updated!" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  res.status(200).json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  let newUser = req.body;
  const existingAdmin = USERS.find((a) => a.username === newUser.username);
  if (existingAdmin) {
    res.status(403).json({ message: "User already exists" });
  } else {
    newUser.purchasedCourses = [];
    USERS.push(newUser);
    res.status(201).json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  res.status(201).json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  // const courseExists = COURSES.find((a) => a.id === courseId);
  var existingCourseIndex = COURSES.findIndex((a) => a.id === courseId);
  var courseAlreadyPurchased = req.user.purchasedCourses.findIndex((a) => a.id === courseId);

  if (existingCourseIndex >= 0 && courseAlreadyPurchased) {
    req.user.purchasedCourses.push(COURSES[existingCourseIndex]);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found / not available / already purchased" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  res.json(req.user.purchasedCourses);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
