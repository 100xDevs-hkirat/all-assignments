const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let courseIdCounter = 0;

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const admin = ADMINS.find((admins) => admin.username == username);
  if (admin) {
    res.status(400).send("Admin already exists");
  }
  ADMINS.push({
    username: username,
    password: password,
  });
  console.log(ADMINS);
  res.json({
    message: "Admin created successfully",
  });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  console.log(ADMINS);
  if (isPresent) {
    res.json({
      message: "Logged in successfully",
    });
  } else {
    res.status(401).send("Admin doesn't exists");
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;

  COURSES.push({
    id: ++courseIdCounter,
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  });
  console.log(COURSES);
  res.json({
    message: "Course created successfully",
    courseId: courseIdCounter,
  });
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const { title, description, price, imageLink, published } = req.body;

  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === courseId) {
      (COURSES[i].title = title),
        (COURSES[i].description = description),
        (COURSES[i].price = price),
        (COURSES[i].imageLink = imageLink),
        (COURSES[i].published = published);
      break;
    }
  }
  console.log(COURSES);
  res.json({
    message: "Course created successfully",
    courseId: courseId,
  });
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.headers;
  USERS.push({
    username: username,
    password: password,
  });
  console.log(USERS);
  res.json({ message: "User created successfully" });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const isPresent = USERS.some(
    (user) => user.username == username && user.password == password
  );

  console.log(ADMINS);
  if (isPresent) {
    res.json({
      message: "Logged in successfully",
    });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  res.json(COURSES);
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  res.json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// { "title": "course title",
// "description": "course description",
// "price": "100",
// "imageLink": "https://linktoimage.com",
// "published": "true"}
