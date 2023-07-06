const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next) {
  const admin = req.headers;
  const existingAdmin = ADMINS.find(
    (el) => el.username === admin.username && el.password === admin.password
  );
  if (!existingAdmin) {
    res.status(403).send("Admin Authentication failed");
  } else next();
}

function userAuthentication(req, res, next) {
  const user = req.headers;
  const existingUser = USERS.find(
    (el) => el.username === user.username && el.password === user.password
  );
  if (!existingUser) {
    res.status(403).send("User authentication failed");
  } else {
    req.user = existingUser;
    next();
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.headers;
  const existingAdmin = ADMINS.find((el) => el.username === admin.username);
  if (existingAdmin) {
    res.status(403).send("Admin already exists");
  } else {
    ADMINS.push(admin);
    res.send("Admin created successfully");
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.send("Logged in Successfully");
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  const id = Date.now();
  course.id = id;
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  const updatedCourse = req.body;
  const course = COURSES.find((el) => el.id === id);
  if (course) {
    Object.assign(course, updatedCourse);
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(403).send("Course not found");
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  user.purchasedCourses = [];
  const existingUser = USERS.find((el) => el.username === user.username);
  if (existingUser) {
    res.status(403).send("User already exists");
  }
  USERS.push(user);
  res.send({ message: "User created successfully" });
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  const courses = COURSES.filter((el) => el.published);
  res.json({ courses: courses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const user = req.user;
  const course = COURSES.find((el) => el.id === id && el.published);
  const alreadyPurchased = user.purchasedCourses.find((el) => el.id === id);
  if (course && !alreadyPurchased) {
    user.purchasedCourses.push(course);
    res.json({ message: "Course purchased successfully" });
  } else if (alreadyPurchased) {
    res.status(403).json({ message: "Course already purchased" });
  }
  res.status(403).json({ message: "Course not found or not available" });
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  res.json({ purchasedCourses: req.user.purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
