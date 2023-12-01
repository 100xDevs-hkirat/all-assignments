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

const findUserDetails = (req, res, next) => {
  const { username, password } = req.headers;

  const user = USERS.find(
    (usr) => usr.username === username && usr.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.json({
      message: "User not found",
    });
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
  const user = { ...req.body, purchasedCourses: [] };

  USERS.push(user);
  res.json({
    message: "User created successfully",
  });
});

app.post("/users/login", findUserDetails, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully", username: req.user.username });
});

app.get("/users/courses", findUserDetails, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((course) => course.published === true) });
});

app.post("/users/courses/:courseId", findUserDetails, (req, res) => {
  // logic to purchase a course
  const courseId = +req.params.courseId;
  const course = COURSES.find(
    (course) => course.id === courseId && course.published === true
  );
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not purchased" });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((course) =>
    req.user.purchasedCourses.includes(course.id)
  );

  res.json({ courses: purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
