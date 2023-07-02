const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "It's secret";

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const jwtAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
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

// Admin routes
app.post("/admin/signup", (req, res) => {
  const adminExists = ADMINS.find((a) => a.username === req.body.username);
  if (adminExists) {
    return res.status(403).json({ message: "Admin already exists" });
  }
  const admin = req.body;
  ADMINS.push(admin);
  const token = generateJwt(admin);
  res.json({ message: "Admin created successfully", token });
});

app.post("/admin/login", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (!admin) {
    return res.sendStatus(403);
  }
  const token = generateJwt(admin);
  res.json({ message: "Logged in successfully", token });
});

app.post("/admin/courses", jwtAuthentication, (req, res) => {
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", jwtAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  let courseIdx = COURSES.findIndex((c) => c.id === courseId);
  if (courseIdx > -1) {
    const updatedCourse = { ...COURSES[courseIdx], ...req.body };
    COURSES[courseIdx] = updatedCourse;
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", jwtAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  const user = req.body;
  const userExists = USERS.find((u) => u.username === user.username);
  if (userExists) {
    return res.sendStatus(403);
  }
  const token = generateJwt(user);
  user.purchasedCourses = [];
  USERS.push(user);
  res.json({ message: "User created successfully", token });
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwt({ username, password });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User already exists" });
  }
});

app.get("/users/courses", jwtAuthentication, (req, res) => {
  const courses = COURSES.filter((c) => c.published);
  res.json(courses);
});

app.post("/users/courses/:courseId", jwtAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const courseAvailable = COURSES.find((c) => c.id === courseId && c.published);
  const user = USERS.find((u) => u.username === req.user.username);
  if (user) {
    if (!courseAvailable) {
      return res.status(404).json({ message: "Course not found" });
    }
    if(user.purchasedCourses.includes(courseId)) {
      return res.status(403).json({ message: "Course Already purchased" });
    }
    user.purchasedCourses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.send(403).json({ message: "User not found" });
  }
});

app.get("/users/purchasedCourses", jwtAuthentication, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username);
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  const purchasedCourses = COURSES.filter((c) =>
    user.purchasedCourses.includes(c.id)
  );
  res.json(purchasedCourses);
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
