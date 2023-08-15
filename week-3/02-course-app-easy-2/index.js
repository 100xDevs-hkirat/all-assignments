const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const adminSecretKey = "abh1superS3cr3t1";
const userSecretKey = "abh1superS3cr3t1";

const generateAdminJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

const validateAdminJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, adminSecretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const validateUserJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  let newAdmin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === newAdmin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(newAdmin);
    let token = generateAdminJwt(newAdmin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  let username = req.headers.username;
  let pass = req.headers.password;

  const existingAdmin = ADMINS.find((a) => a.username === username && a.password === pass);
  if (existingAdmin) {
    let token = generateAdminJwt(existingAdmin);
    res.status(201).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", validateAdminJwtToken, (req, res) => {
  let courseDetails = req.body;
  let id = Math.floor(Math.random() * 100);
  courseDetails.id = id;
  COURSES.push(courseDetails);
  res.status(201).json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", validateAdminJwtToken, (req, res) => {
  let newCourseDetails = req.body;
  let courseId = parseInt(req.params.courseId);
  var existingCourseIndex = COURSES.findIndex((a) => a.id === courseId);
  if (existingCourseIndex >= 0) {
    newCourseDetails.id = COURSES[existingCourseIndex].id;
    COURSES[existingCourseIndex] = newCourseDetails;
    res.status(201).json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not updated!" });
  }
});

app.get("/admin/courses", validateAdminJwtToken, (req, res) => {
  res.status(200).json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  let newUser = req.body;
  const existingAdmin = USERS.find((a) => a.username === newUser.username);
  if (existingAdmin) {
    res.status(403).json({ message: "User already exists" });
  } else {
    newUser.purchasedCourses = [];
    USERS.push(newUser);
    let token = generateUserJwt(newUser);
    res.status(201).json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  let username = req.headers.username;
  let pass = req.headers.password;

  const existingUser = USERS.find((a) => a.username === username && a.password === pass);
  if (existingUser) {
    let token = generateUserJwt(existingUser);
    res.status(201).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", validateUserJwtToken, (req, res) => {
  res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId", validateUserJwtToken, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", validateUserJwtToken, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
