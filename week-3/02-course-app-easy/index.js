const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password == password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username == admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created succefully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now;
  COURSES.push(course);
  res.json({ message: "course created succefully", courseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((a) => a.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "course updated succefully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ course: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = {...req.body, purchasedCourses:[]}
  const existingUser = USERS.find((a) => a.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: "user already exists" });
  } else {
    USERS.push(user);
    res.json({ message: "user created succefully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in succefully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  const publishedCourses = COURSES.filter((c) => c.published);
  res.send({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((a) => a.courseId === courseId && a.published);
  if (course) {
    req.user.purchasedCourses.push(course);
    res.json({ message: "course purchased successfully" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((p) =>
    req.user.purchasedCourses.includes(p.id)
  );
  res.send({ purchasedCourses: purchasedCourses });
}); 

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
 