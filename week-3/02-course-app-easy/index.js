const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next) {
  let { username, password } = req.headers;
  let admin = ADMINS.find(
    (A) => A.username == username && A.password == password
  );
  if (admin) {
    next();
  } else {
    res.status(404).json({ message: "Admin Authentication failed" });
  }
}

function userAuthentication(req, res, next) {
  let { username, password } = req.headers;
  let user = USERS.find(
    (A) => A.username == username && A.password == password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(404).json({ message: "User Authentication failed" });
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  let existingAdmin = ADMINS.find(
    (a) => a.username == req.body.username && a.password == req.body.password
  );
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exits" });
  } else {
    const admin = {
      username: req.body.username,
      password: req.body.password,
    };

    ADMINS.push(admin);
    res.status(201).json({
      message: "Admin created successfully",
      Description: "Creates a new admin account",
      success: true,
    });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  res.status(200).json({
    message: "Logged in successfully",
    Description: "Authenticates an admin",
    success: true,
  });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.id = Math.floor(Math.random() * 1000);
  COURSES.push(course);

  res.status(201).json({
    message: "Course created successfully",
    success: true,
    courseId: course.couresId,
  });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course

  let courseId = req.params.courseId;
  let course = COURSES.find((c) => c.couresId == courseId);
  if (course) {
    let updatedCourse = req.body;
    for (var item of Object.keys(updatedCourse)) {
      course[item] = updatedCourse[item];
    }

    res.status(200).json({
      messages: "Course updated successfully",
      success: true,
    });
  } else {
    res.status(404).json({
      message: "course not found",
      success: false,
    });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses

  res.status(200).json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let existindUser = USERS.find(
    (u) => u.username == req.body.username && u.password == req.body.password
  );
  if (existindUser) {
    res.status(403).json({ message: "User already exists" });
  } else {
    let user = req.body;
    USERS.push(user);
    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.status(200).json({
    message: "Logged in successfully",
    success: true,
  });
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  let filteredCourses = [];
  for (var i = 0; i < COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.status(200).json({
    courses: filteredCourses,
  });
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  let course = COURSES.find((c) => c.couresId == courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(course.couresId);
    res.status(200).json({
      message: "Course purchased successfully",
      success: true,
    });
  } else {
    res.status(403).json({
      message: "course not found or not available",
      success: false,
    });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  let purchasedCoursesId = req.user.purchasedCourses;
  let purchasedCourses = [];
  for (var i = 0; i < COURSES.length; i++) {}
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
