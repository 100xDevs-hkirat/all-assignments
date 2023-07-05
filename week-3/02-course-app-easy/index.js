const express = require("express");
const app = express();

app.use(express.json());
// Custom Middlewares
const findAdminDetails = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  if (admin) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Autherntication failed, cannot find user" });
  }
};

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;

  const isAdmin = ADMINS.find((user) => {
    return user.username === admin.username;
  });

  if (isAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.status(201).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", findAdminDetails, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: "Logged in successfully" });
});

app.post("/admin/courses", findAdminDetails, (req, res) => {
  // logic to create a course
  const course = req.body;
  COURSES.push(course);
  course.id = Date.now();
  res
    .status(200)
    .json({ message: "Course created successfully", id: course.id });
});

app.put("/admin/courses/:courseId", findAdminDetails, (req, res) => {
  // logic to edit a course
  const id = req.params.courseId * 1;
  const course = COURSES.find((course) => course.id === id);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.json({ message: "Course not found" });
  }
});

app.get("/admin/courses", findAdminDetails, (req, res) => {
  // logic to get all courses
  res.json({
    courses: COURSES,
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
