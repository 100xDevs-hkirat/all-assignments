const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Authentication
function adminAuthentication(req, res, next) {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
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
    (u) => u.username === username && u.password === password
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
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  res.send({ message: "Logged in successfully"});
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = req.params.courseId;
  const course = COURSES.find((c) => c.id.toString() === courseId);
  if (course) {
    const newCourse = req.body;
    // const courseIdx = COURSES.findIndex(course => course.id.toString() === courseId);
    // newCourse.id = courseId;
    // COURSES[courseIdx] = newCourse;
    Object.assign(course, newCourse);
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course doesn't exist" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  if (COURSES) {
    res.json(COURSES);
  } else {
    res.status(404).json({ message: "No course available" });
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  const userExists = USERS.find((u) => u.username === req.body.username);
  if (userExists) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const user = { ...req.body, courses: [] };
    USERS.push(user);
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  if (COURSES) {
    res.json({ courses: COURSES.filter((c) => c.published) });
  } else {
    res.status(404).json({ message: "No courses available" });
  }
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = req.params.courseId;
  // const user = req.user;  <---- remember this added in middleware*****
  const course = COURSES.find(
    (c) => c.id.toString() === courseId && c.published
  );
  if (course) {
    // const userIdx = USERS.findIndex(u => u.username === req.headers.username);
    // if(!USERS[userIdx].courses) {
    //   USERS[userIdx].courses = [];
    // }
    // USERS[userIdx].courses.push(course);
    req.user.courses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // const user = req.user; // <--- added in middleware
  // const user = USERS.find(u => u.username === req.headers.username);
  const purchasedCourses = COURSES.filter(c => req.user.courses.includes(c.id.toString()));
  res.json(purchasedCourses);
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
