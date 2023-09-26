const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const SECRET_KEY = "LyahKpu4AE0=";
const ADMINS_FILE_NAME = "admins.json";
const USERS_FILE_NAME = "users.json";
const COURSES_FILE_NAME = "courses.json";

fs.readFile(ADMINS_FILE_NAME, "utf8")
  .then(JSON.parse)
  .then((data) => (ADMINS = data))
  .catch((err) => {
    ADMINS = [];
  });

fs.readFile(USERS_FILE_NAME, "utf8")
  .then(JSON.parse)
  .then((data) => (USERS = data))
  .catch((err) => {
    USERS = [];
  });

fs.readFile(COURSES_FILE_NAME, "utf8")
  .then(JSON.parse)
  .then((data) => (COURSES = data))
  .catch((err) => {
    COURSES = [];
  });

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;

  const foundAdminIndex = ADMINS.findIndex(
    (admin) => admin.username === username
  );
  if (foundAdminIndex > -1) return res.sendStatus(409); //a security issue

  const token = generateToken({ username });

  ADMINS.push({ username, password });
  fs.writeFile(ADMINS_FILE_NAME, JSON.stringify(ADMINS))
    .then(() => res.json({ message: "Admin created successfully", token }))
    .catch((err) => res.sendStatus(500));
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) return res.sendStatus(401);

  const foundAdminIndex = ADMINS.findIndex(
    (admin) => admin.username === username && admin.password === password
  );
  if (foundAdminIndex === -1)
    return res.status(403).json({ error: "Invalid username or password" });

  const token = generateToken({ username });

  res.json({ message: "Logged in successfully", token });
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  const { title, description, price, imageLink, published } = req.body;

  if (!title || !description || !price || !imageLink || !published)
    return res.status(400).json({ message: "Malformed request" });

  const courseId = Date.now();

  COURSES.push({
    id: courseId,
    title,
    description,
    price,
    imageLink,
    published,
  });
  fs.writeFile(COURSES_FILE_NAME, JSON.stringify(COURSES))
    .then(() => res.json({ message: "Course created successfully", courseId }))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);

  const foundCourseIndex = COURSES.findIndex(
    (course) => course.id === courseId
  );

  if (foundCourseIndex < 0)
    res.sendStatus(404).json({ message: "Course not found" });
  else {
    COURSES[foundCourseIndex] = { ...COURSES[foundCourseIndex], ...req.body };
    fs.writeFile(COURSES_FILE_NAME, JSON.stringify(COURSES))
      .then(() => res.json({ message: "Course updated successfully" }))
      .catch((err) => res.sendStatus(500));
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;

  const foundUserIndex = USERS.findIndex((user) => user.username === username);
  if (foundUserIndex > -1) return res.sendStatus(409); //a security issue

  const token = generateToken({ username });

  USERS.push({ username, password, purchasedCourses: [] });
  fs.writeFile(USERS_FILE_NAME, JSON.stringify(USERS))
    .then(() => res.json({ message: "User created successfully", token }))
    .catch((err) => res.sendStatus(500));
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) return res.sendStatus(401);

  const foundUserIndex = USERS.findIndex(
    (user) => user.username === username && user.password === password
  );
  if (foundUserIndex === -1)
    return res.status(403).json({ error: "Invalid username or password" });

  const token = generateToken({ username });

  res.json({ message: "Logged in successfully", token });
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  const publishedCourses = COURSES.filter((course) => course.published);

  res.json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);

  const foundCourseIndex = COURSES.findIndex(
    (course) => course.id === courseId && course.published
  );
  if (foundCourseIndex === -1)
    return res.status(404).json({ message: "Course not found" });

  const user = USERS.find((u) => u.username === req.user.username);
  if (user.purchasedCourses.indexOf(courseId) > -1)
    return res.status(409).json({ message: "Course already purchased" }); //would probably show purchased on UI
  user.purchasedCourses.push(courseId);
  fs.writeFile(USERS_FILE_NAME, JSON.stringify(USERS))
    .then(() => res.json({ message: "Course purchased successfully" }))
    .catch((err) => res.sendStatus(500));
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username);
  const purchasedCourses = COURSES.filter(
    (course) => user.purchasedCourses.indexOf(course.id) > -1
  );

  res.json({ purchasedCourses });
});

function generateToken({ username }) {
  const payload = { username };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
}

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
