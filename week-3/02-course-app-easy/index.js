const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  const adminExist = ADMINS.find(
    (ad) => ad.username === username && ad.password === password
  );
  if (adminExist) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuth = (req, res, next) => {
  const { username, password } = req.headers;
  const userExist = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (userExist) {
    req.user = userExist;
    next();
  } else {
    res.status().json({ message: "User Authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const newAdmin = req.body;
  const newAdminExist = ADMINS.find((ad) => ad.username === newAdmin.username);
  if (newAdminExist) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(newAdmin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuth, (req, res) => {
  // logic to log in admin
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuth, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  if (!newCourse.title && !newCourse.description) {
    res
      .status(411)
      .json({ message: "Make sure to give title and description " });
  }
  newCourse.id = Date.now();
  COURSES.push(newCourse);
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", adminAuth, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const coursExist = COURSES.find((c) => c.id === courseId);
  if (coursExist) {
    Object.assign(coursExist, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", adminAuth, (req, res) => {
  // logic to get all courses
  res.json({ course: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  // const newUser = req.body;
  const newUser = {
    ...req.body,
    purchasedCourses: [],
  };
  const newUserExist = USERS.find(
    (u) => u.username === newUser.username && u.password === newUser.password
  );
  if (newUserExist) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(newUser);
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuth, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuth, (req, res) => {
  // logic to list all courses
  const filteredCourses = COURSES.filter((c) => c.published);
  res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuth, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(course);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", userAuth, (req, res) => {
  // logic to view purchased courses
  // const purchasedCourses = COURSES.filter((c) =>
  //   req.user.purchasedCourses.includes(c.id)
  // );
  const purchasedCourseIds = req.user.purchasedCourses;
  const purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i]) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
