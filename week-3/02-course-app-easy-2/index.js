const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASED_COURSES = [];

// generating the json token
function generateToken(user) {
  const payload = {
    username: user.username,
    password: user.password,
  };

  const token = jwt.sign(payload, "yourSecretKey", { expiresIn: "1h" });

  return token;
}

// verify the token submitted by user/admin, the function is a middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, "yourSecretKey", (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const newAdmin = { username: "admin", password: "pass" };
  ADMINS.push(newAdmin);
  const yourToken = generateToken(newAdmin);
  const output = {
    message: "Admin created successfully",
    yourToken: yourToken,
  };
  res.json(output);
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }

  const index = ADMINS.findIndex((item) => item.username === username);
  if (index !== -1 && ADMINS[index]["password"] === password) {
    const yourToken = generateToken(ADMINS[index]);
    const output = { message: "Logged in successfully", yourToken: yourToken };
    res.send(output);
  } else {
    res.send("invalid credentials");
  }
});

app.post("/admin/courses", authenticateToken, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  const courseId = Math.floor(Math.random() * 10000000000);

  const course = {
    courseId: courseId,
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  };

  COURSES.push(course);
  const mes = { message: "Course created successfully", courseId: courseId };
  res.json(mes);
});

app.put("/admin/courses/:courseId", authenticateToken, (req, res) => {
  // logic to edit a course

  const { title, description, price, imageLink, published } = req.body;

  const id = parseInt(req.params.courseId);
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

    res.json(mes);
  } else {
    res.sendStatus(404);
  }
});

app.get("/admin/courses", authenticateToken, (req, res) => {
  // logic to get all courses
  res.json({ COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const newUser = {
    username: username,
    password: password,
  };
  USERS.push(newUser);

  const yourToken = generateToken(newUser);
  const output = {
    message: "User created successfully",
    token: yourToken,
  };
  res.json(output);
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  if (username == null || password == null) {
    res.sendStatus(401);
  }

  const index = USERS.findIndex((user) => user.username === username);
  if (index !== -1 && USERS[index]["password"] === password) {
    const yourToken = generateToken(USERS[index]);
    const output = { message: "Logged in successfully", yourToken: yourToken };
    res.json(output);
  } else {
    res.send("Invalid credentials");
  }
});

app.get("/users/courses", authenticateToken, (req, res) => {
  // logic to list all courses
  res.json({ COURSES });
});

app.post("/users/courses/:courseId", authenticateToken, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  console.log(id);
  const course = COURSES.findIndex((item) => item.courseId === id);
  console.log(course);
  if (course === -1) {
    res.sendStatus(404);
  } else {
    const output = { message: "Course purchased successfully" };
    res.json(output);
  }
});

app.get("/users/purchasedCourses", authenticateToken, (req, res) => {
  // logic to view purchased courses
  res.json({ PURCHASED_COURSES });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
