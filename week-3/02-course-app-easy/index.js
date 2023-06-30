const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASED_COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const newAdmin = { username: "admin", password: "pass" };
  ADMINS.push(newAdmin);
  res.send("Admin created successfully");
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }

  const index = ADMINS.findIndex((item) => item.username === username);
  if (index !== -1 && ADMINS[index]["password"] === password) {
    const mes = { message: "Logged in successfully" };
    res.send(mes);
  } else {
    res.send("invalid credentials");
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }

  const index = ADMINS.findIndex((item) => item.username === username);
  if (index !== -1 && ADMINS[index]["password"] === password) {
    const course = {
      courseId: Math.floor(Math.random() * 10000000000),
      title: "course title",
      description: "course description",
      price: 100,
      imageLink: "https://linktoimage.com",
      published: true,
    };

    COURSES.push(course);
    const mes = { message: "Course created successfully", courseId: 1 };
    res.json(mes);
  } else {
    res.send("invalid credentials");
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.send("Please provide login details");
  }
  const { title, description, price, imageLink, published } = req.body;
  const id = parseInt(req.query.courseId);
  const getIndex = COURSES.findIndex((item) => item.courseId === id);
  if (getIndex !== -1) {
    COURSES[getIndex] = {
      courseId: id,
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
      published: published,
    };

    const mes = { message: "Course updated successfully" };

    res.send(mes);
  } else {
    res.sendStatus(404);
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.send("Please provide login details");
  }
  const admin = ADMINS.findIndex((item) => item.username === username);
  if (admin !== -1 && ADMINS[admin]["password"] === password) {
    res.json({ COURSES });
  } else {
    res.sendStatus(401);
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const newUser = { username: "user", password: "pass" };
  USERS.push(newUser);

  const mes = { message: "User created successfully" };
  res.send(mes);
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }
  const findUser = USERS.findIndex((user) => user.username === username);
  if (findUser !== -1) {
    const mes = { message: "Logged in successfully" };
    res.send(mes);
  } else {
    res.send("User not found");
  }
});

app.get("/users/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.send("Please provide login details");
  }
  const user = USERS.findIndex((item) => item.username === username);
  if (user !== -1 && USERS[user]["password"] === password) {
    res.json({ COURSES });
  } else {
    res.sendStatus(401);
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.query.courseId);
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }
  const findUser = USERS.findIndex((user) => user.username === username);
  if (findUser !== -1 && USERS[findUser]["password"] === password) {
    const course = COURSES.findIndex((item) => item.courseId === id);
    if (course === -1) {
      res.sendStatus(404);
    } else {
      PURCHASED_COURSES.push(COURSES[course]);
      const mes = { message: "Course purchased successfully" };
      res.send(mes);
    }
  } else {
    res.send("User not found");
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }
  const findUser = USERS.findIndex((user) => user.username === username);
  if (findUser !== -1 && USERS[findUser]["password"] === password) {
    res.json({ PURCHASED_COURSES });
  } else {
    res.send("User not found");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
