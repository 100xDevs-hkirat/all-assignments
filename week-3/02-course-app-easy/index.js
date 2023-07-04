const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const Secret_key = "MI68258";
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const data = {
    isAdmin: true,
    username: req.headers.username,
    password: req.headers.password,
  };
  if (ADMINS.push(data) && data.username) {
    const payload = {
      username: req.headers.username,
      password: req.headers.password,
    };
    const token = jwt.sign(payload, Secret_key, { expiresIn: "1h" });
    res.header("Authorization", `Bearer ${token}`);
    res.status(200).send("Admin Created successfulyy");
  } else {
    return res
      .status(401)
      .send(
        "Some error while creating admin , please try again after sometime"
      );
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const cred = {
    username: req.headers.username,
    password: req.headers.password,
  };
  console.log(req.headers.username);
  const index = ADMINS.findIndex((item) => item.username == cred.username);
  console.log(index);
  if (index != -1 && ADMINS[index].isAdmin) {
    if (ADMINS[index].password != cred.password) {
      return res.status(404).send("Invalid Password");
    } else {
      res.status(200).send("Admin logged successfully ");
    }
  } else {
    return res.status(404).send("Such Admin doesn't exist , please signup");
  }
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
