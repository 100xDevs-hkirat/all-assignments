const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const doesEntryExist = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (doesEntryExist) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const doesEntryExist = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (doesEntryExist) {
    req.user = doesEntryExist;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (!existingAdmin) {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  } else {
    res.status(403).json({ message: "Admin already exists" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.courseId = Date.now();
  COURSES.push(course);
  res.json({
    message: "Course created successfully",
    courseId: course.courseId,
  });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  var course = COURSES.find((allCourse) => allCourse.courseId === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCourses: [] };
  const existingUser = USERS.find((a) => a.username === user.username);
  if (!existingUser) {
    USERS.push(user);
    res.json({ message: "User created successfully" });
  } else {
    res.status(403).json({ message: "User already exists" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  var publishedCourses = COURSES.filter((course) => course.published);
  res.json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const headerCourseId = parseInt(req.params.courseId);
  var course = COURSES.find((crs) => crs.courseId === headerCourseId);
  if (course) {
    if (course.published) {
      req.user.purchasedCourses.push(headerCourseId);
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(401).json({ message: "Course is not yet published" });
    }
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchases = COURSES.filter((c) =>
    req.user.purchasedCourses.includes(c.courseId)
  );
  res.json({ purchasedCourses: purchases });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
