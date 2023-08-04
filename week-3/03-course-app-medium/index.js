const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let ADMINS;
let USERS;
let COURSES;

const adminSecret = "admin";
const userSecret = "user";

function generateToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function authenticateJWTAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, adminSecret, (err, admin) => {
      if (err) return res.sendStatus(403);

      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function authenticateJWTUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, userSecret, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

try {
  ADMINS = JSON.parse(fs.readFileSync("admins.json", "utf8"));
  USERS = JSON.parse(fs.readFileSync("users.json", "utf8"));
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find((a) => username === a.username);

  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push({ username, password });

    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    const token = generateToken({ username, role: "admin" }, adminSecret);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => username === a.username && password === a.password
  );

  if (admin) {
    const token = generateToken({ username, role: "admin" }, adminSecret);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "Admin login failed" });
  }
});

app.post("/admin/courses", authenticateJWTAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);

  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.json({ message: "Course created successfully", id: course.id });
});

app.put("/admin/courses/:courseId", authenticateJWTAdmin, (req, res) => {
  // logic to edit a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => courseId === c.id);

  if (course) {
    Object.assign(course, req.body);

    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course does not exist." });
  }
});

app.get("/admin/courses", authenticateJWTAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = USERS.find((u) => username === u.username);

  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push({ username, password, purchasedCourses: [] });

    fs.writeFileSync("users.json", JSON.stringify(USERS));
    const token = generateToken({ username, role: "user" }, userSecret);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => username === u.username && password === u.password
  );

  if (user) {
    const token = generateToken({ username, role: "user" }, userSecret);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User login failed" });
  }
});

app.get("/users/courses", authenticateJWTUser, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((course) => course.published) });
});

app.post("/users/courses/:courseId", authenticateJWTUser, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => courseId === c.id);

  if (course) {
    const user = USERS.find((u) => req.user.username === u.username);
    user.purchasedCourses.push(courseId);

    fs.writeFileSync("users.json", JSON.stringify(USERS));
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not exists" });
  }
});

app.get("/users/purchasedCourses", authenticateJWTUser, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => req.user.username === u.username);
  res.json({
    purchasedCourses: COURSES.filter((course) =>
      user.purchasedCourses.includes(course.id)
    ),
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
