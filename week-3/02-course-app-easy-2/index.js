const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let ADMINS = [];
let USERS = [];
let COURSES = [];

let secret = "SECRET1234";

function generateJwtToken(user) {
  let payload = {
    username: user.username,
    id: user.id,
  };
  let token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return token;
}

function authenticateJwt(req, res, next) {
  console.log(req.headers);
  let authheader = req.headers.authorization;
  console.log(authheader);
  if (authheader) {
    let token = authheader.split(" ")[1];
    console.log(token);
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        res.status(403).json({
          err: err,
        });
      }
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    res.status(401);
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let { username, password } = req.body;
  let existingAdmin = ADMINS.find(
    (a) => a.username == username && a.password == password
  );
  if (existingAdmin) {
    res.status(403).json({
      message: "Admin already exists",
      success: false,
    });
  } else {
    let admin = {
      id: Math.floor(Math.random() * 10000),
      username,
      password,
      createdAt: new Date(),
    };
    ADMINS.push(admin);
    let token = generateJwtToken(admin);
    res.status(201).json({
      message: "created successfully",
      token: token,
      success: true,
    });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  let { username, password } = req.headers;
  let existingAdmin = ADMINS.find(
    (a) => a.username == username && a.password == password
  );
  if (existingAdmin) {
    let token = generateJwtToken(existingAdmin);
    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      success: true,
    });
  } else {
    res.status(403).json({
      message: "admin does't exist",
      success: false,
    });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  let course = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published,
    courseId: COURSES.length + 1,
  };
  COURSES.push(course);
  res.status(201).json({
    message: "Course created successfully ",
    courseId: course.courseId,
    success: true,
  });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let courseIndex = COURSES.findIndex((c) => c.courseId == courseId);
  if (courseIndex != -1) {
    let updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.status(200).json({
      message: "Course updated successfully",
      success: true,
    });
  } else {
    res.status(404).json({
      message: "Course does't exist",
    });
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let { username, password } = req.body;
  let existingUser = USERS.find(
    (u) => u.username == username && u.password == password
  );
  if (existingUser) {
    res.status(403).json({
      message: "User already exists",
      success: false,
    });
  } else {
    let user = {
      id: Math.floor(Math.random() * 10000),
      username: username,
      password: password,
      createdAt: new Date(),
    };
    let token = generateJwtToken(user);
    res.status(201).json({
      message: "User created successfully",
      token: token,
      success: true,
    });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;
  let user = USERS.find(
    (u) => u.username == username && u.password == password
  );
  if (user) {
    let token = generateJwtToken(user);
    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      token: token,
    });
  } else {
    res.status(403).json({
      message: "User does't exists",
      success: false,
    });
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  res.status(200).json({ courses: COURSES });
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  let couresId = req.params.courseId;
  let course = COURSES.find((c) => c.couresId == couresId);
  if (course) {
    let user = USERS.find(
      (u) => u.username == req.user.username && u.id == req.user.id
    );
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.status(200).json({
        message: "Course purchased successfully",
        success: true,
      });
    } else {
      res.status(403).json({
        message: "User does't exist",
        success: false,
      });
    }
  } else {
    res.status(404).json({
      message: "course not found",
      success: false,
    });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  let user = USERS.find(
    (u) => u.id == req.user.id && u.username == req.user.username
  );
  if (user) {
    res.status(200).json({
      purchasedCourses: user.purchasedCourses,
      success: true,
    });
  } else {
    res.status(403).json({
      message: "User does't exists",
      success: false,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
