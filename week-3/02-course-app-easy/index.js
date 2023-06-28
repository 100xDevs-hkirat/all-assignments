const express = require("express");
const body_parser = require("body-parser");
const app = express();

app.use(express.json());
app.use(body_parser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASES = [];
let idCounter = 0;

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.headers;
  ADMINS.push({
    username: username,
    password: password,
  });
  res.json({ message: "Admin created successfully" });

  res.json("success");
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  if (isPresent) {
    req.json({ message: "Logged in successfully" });
  } else {
    res.status(400).json({ error: "Please enter correct credentials" });
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  if (isPresent) {
    const { title, description, price, imageLink, published } = req.body;
    COURSES.push({
      id: ++idCounter,
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
      published: published,
    });
    req.json({ message: "Course created successfully", courseId: idCounter });
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );
  if (isPresent) {
    const updateId = req.params.courseId;
    const { title, description, price, imageLink, published } = req.body;
    let isUpdated = false;

    for (let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id == updateId) {
        COURSES[i].title = title;
        COURSES[i].description = description;
        COURSES[i].price = price;
        COURSES[i].imageLink = imageLink;
        COURSES[i].published = published;
        isUpdated = true;
      }
    }
    if (isUpdated) res.json({ message: "Course updated successfully" });
    else {
      res.status(400).json({ error: "The requested course id is not present" });
    }
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  if (isPresent) {
    res.json({ courses: COURSES });
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
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
