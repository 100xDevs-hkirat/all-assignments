const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const adminSecret = "siya";
const userSecret = "ram";

let ADMINS = [];
let USERS = [];
let COURSES = [];

function generateToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function authenticateJWTAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, adminSecret, (err, admin) => {
      if (err) {
        return res.sendStatus(403);
      }

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
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find((u) => username === u.username);

  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push({ username, password });
    const token = generateToken({ username }, adminSecret);
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
    const token = generateToken({ username }, adminSecret);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin login failed" });
  }
});

app.post("/admin/courses", authenticateJWTAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: "Course created successfully", id: course.id });
});

app.put("/admin/courses/:courseId", authenticateJWTAdmin, (req, res) => {
  // logic to edit a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => courseId === c.id);

  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.json({ message: "Course doesn't exists" });
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
    res.send({ message: "User already exists" });
  } else {
    USERS.push({ username, password, purchasedCourses: [] });
    const token = generateToken({ username }, userSecret);
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
    const token = generateToken({ username }, userSecret);
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
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not exists" });
  }
});

app.get("/users/purchasedCourses", authenticateJWTUser, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => req.user.username === u.username);
  const purchasedCourses = COURSES.filter((course) =>
    user.purchasedCourses.includes(course.id)
  );
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
