const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "anySecretKey";

const generateJwt = (username) => {
  return jwt.sign({ user: username }, secretKey, { expiresIn: "1h" });
};

const authJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        return res.status(401).json({ message: "Authorization Falied" });
      }

      req.user = data.user;
      next();
    });
  } else {
    res.status(403).json({ message: "Authorization Header not found" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const usernameFound = ADMINS.find((admin) => admin.username === username);

  if (usernameFound) {
    res.status(403).json({ message: "Username already exist" });
  } else {
    const token = generateJwt(username);
    ADMINS.push({ username, password });
    res.status(201).json({ message: "Admin created Successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;

  const adminFound = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (adminFound) {
    const token = generateJwt(username);
    res.status(200).json({ message: "Logged in Successfully", token });
  } else {
    res.status(404).json({ message: "username or password is incorrect" });
  }
});

app.post("/admin/courses", authJwt, (req, res) => {
  // logic to create a course
  const courseDetails = req.body;

  if (!courseDetails) {
    return res.status(404).json({ message: "Course Details are not present" });
  }

  courseDetails.id = Math.floor(Math.random() * 1000);

  COURSES.push(courseDetails);

  res.status(201).json({
    message: "Course Created Successfully",
    courseId: courseDetails.id,
  });
});

app.put("/admin/courses/:courseId", authJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);

  const courseFound = COURSES.find((course) => course.id === courseId);

  if (courseFound) {
    Object.assign(courseFound, req.body);

    res.status(200).json({ message: "Course Updated Successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authJwt, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  const userExist = USERS.find((user) => user.username === username);

  if (userExist) {
    res.status(406).json({ message: "Username already exists" });
  } else {
    USERS.push({ username, password });
    const token = generateJwt(username);
    res.status(201).json({ message: "user created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;

  const userFound = USERS.find(
    (user) => user.username && user.password === password
  );

  if (userFound) {
    const token = generateJwt(username);

    res.status(202).json({ message: "Logged in Successfully", token });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

app.get("/users/courses", authJwt, (req, res) => {
  // logic to list all courses
  res.status(200).json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);

  const courseFound = COURSES.find((course) => course.id === courseId);

  if (courseFound) {
    const user = USERS.find((user) => user.username === req.user);

    if (!user.purchasedCourses) {
      user.purchasedCourses = [];
    }

    user.purchasedCourses.push(courseFound);

    res.status(200).json({
      message: "course Purchased Successfully",
    });
  } else {
    res.status(404).json({
      message: "Course not found",
    });
  }
});

app.get("/users/purchasedCourses", authJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((user) => user.username === req.user);

  res.status(200).json({
    purchasedCourses: user.purchasedCourses,
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
