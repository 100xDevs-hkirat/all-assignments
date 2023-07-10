import express from "express";
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
  if (admin) next();
  else res.status(403).json({ message: "Admin authentication failed" });
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else res.status(403).json({ message: "User authentication failed" });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;
  const admin = {
    username: username,
    password: password,
  };
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (!existingAdmin) {
    ADMINS.push({ username: username, password: password });
    res.json({ message: "Admin account created..." });
  } else res.status(403).send({ message: "Account already exists" });
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  const courseDetails = req.body;
  courseDetails.id = Date.now();
  COURSES.push(courseDetails);
  res.json({
    message: "Course created successfully",
    courseId: courseDetails.id,
  });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.courseId === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else res.status(404).json({ message: "Course not found" });
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  const user = { ...req.body, purchasedCourses: [] };
  USERS.push(user);
  res.json({ message: "User created successfully" });
});

app.post("/users/login", userAuthentication, (req, res) => {
  res.json({ message: "User logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  const filteredCourses = COURSES.filter((c) => c.published);
  res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const checkCourse = COURSES.find((c) => c.id === courseId && c.published);
  if (checkCourse) {
    req.user.purchasedCourses.push(checkCourse);
    res.json({ message: "Course purchased successfully." });
  } else res.status(404).json({ message: "Course not found or not available" });
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  const purchasedCourses = COURSES.find(
    (c) => c.id === req.body.purchasedCourses.includes(c.id)
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
