const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next) {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => username === a.username && password === a.password
  );

  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
}

function userAuthentication(req, res, next) {
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => username === u.username && password === u.password
  );

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const adminExist = ADMINS.find((a) => admin["username"] === a.username);

  if (adminExist) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course["id"] = Date.now();
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course["id"] });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const updatedCourse = req.body;
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => courseId === c["id"]);

  if (course) {
    Object.assign(course, updatedCourse);
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
  const user = req.body;

  const userExist = USERS.find((u) => user["username"] === u.username);
  if (userExist) {
    res.status(403).json({ message: "User already exists" });
  } else {
    user["purchasedCourses"] = [];
    USERS.push(user);
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((course) => course["published"]) });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => courseId === c["id"]);

  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not exists" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((course) =>
    req.user.purchasedCourses.includes(course.id)
  );
  res.json(purchasedCourses);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
