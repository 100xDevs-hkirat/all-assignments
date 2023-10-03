const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const secret = "super-dooper-secret";

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.header.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        req.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.json({ message: "Admin created succefully" }, token);
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.header;
  const admin = ADMINS.find(
    (a) => a.username === username,
    a.password === password
  );
  if (admin) {
    const token = generateJwt(admin);
    res.json({ message: "logged in successfully" }, token);
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  COURSES.push({ ...course, id: course.length + 1 });
  res.json({ message: "Course created succefully" });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const courseIndex = COURSES.findIndex((a) => a.id === courseId);
  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: "course updated succesfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find(
    (a) => a.username === user.username && a.password === user.password
  );
  if (existingUser) {
    res.status(403).json({ message: " User already exist" });
  } else {
    USERS.push(user);
    const token = generateJwt(user);
    res.json({ message: "User created successfully", token: token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (user) {
    const token = generateJwt(user);
    res.json({ message: "Logged in succefully", token });
  } else {
    res.status(403).json({ message: "Authentication Denied" });
  }
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const findCourse = COURSES.find((a) => a.courseId === courseId);
  if (findCourse) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourse) {
        user.purchasedCourse = [];
      }
      if (user.purchasedCourse.includes(findCourse)) {
        res.status(400).json({ message: "Course already purchased" });
      }
      user.purchasedCourse.push(findCourse);
      res.json({ message: "Course purchase succefully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(403).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((a) => a.username === req.user.username);
  if (user && user.purchasedCourse) {
    res.json({ purchasedCourses: user.purchasedCourse });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
