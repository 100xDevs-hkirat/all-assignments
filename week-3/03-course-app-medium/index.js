const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  const adminsFileContent = fs.readFileSync("admins.json", "utf8");
  ADMINS = adminsFileContent ? JSON.parse(adminsFileContent) : [];

  const usersFileContent = fs.readFileSync("users.json", "utf8");
  USERS = usersFileContent ? JSON.parse(usersFileContent) : [];

  const coursesFileContent = fs.readFileSync("courses.json", "utf8");
  COURSES = coursesFileContent ? JSON.parse(coursesFileContent) : [];
} catch (err) {
  console.error("Error reading files:", err);
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find((a) => a.username === username);
  console.log("admin signup");
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = { username, password };
    ADMINS.push(newAdmin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
