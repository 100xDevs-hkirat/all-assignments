const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Middleware for Auth
const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(404).send("username or password are invalid");
  }

  const userFound = ADMINS.find(
    (user) => user.username === username && user.password === password
  );

  if (!userFound) {
    return res.status(404).send("username or password are incorrect");
  }

  next();
};

const userAuth = (req, res, next) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(404).send("username or password are invalid");
  }

  const userFound = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (!userFound) {
    return res.status(404).send("username or password are incorrect");
  }

  next();
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).send("username or password are invalid");
  }

  const adminExist = ADMINS.find((admin) => admin.username === username);

  if (adminExist) {
    res.status(403).json({ message: "admin already exists" });
  } else {
    ADMINS.push({ username, password });

    res.status(201).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuth, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuth, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;

  const id = Math.floor(Math.random() * 1000);

  COURSES.push({
    title,
    description,
    price,
    imageLink,
    published,
    id,
  });

  res
    .status(201)
    .json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", adminAuth, (req, res) => {
  // logic to edit a course

  const id = parseInt(req.params.courseId);

  const course = COURSES.find((course) => course.id === id);

  if (!course) {
    res.status(404).json({ message: "error occurred, no course found" });
  } else {
    Object.assign(course, req.body);
    res.status(201).json({ message: "course updated successfully" });
  }
});

app.get("/admin/courses", adminAuth, (req, res) => {
  // logic to get all courses
  res.status(200).json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  if ((!username, !password)) {
    return res.status(404).json({ message: "username or password is invalid" });
  }

  const userExist = USERS.find((user) => user.username === username);

  if (userExist) {
    res.status(403).json({ message: "user already exists" });
  } else {
    USERS.push({ username, password, purchasedCourses: [] });

    res.status(201).json({ message: "user created successfully" });
  }
});

app.post("/users/login", userAuth, (req, res) => {
  // logic to log in user
  res.status(200).json({ message: "user login successfully" });
});

app.get("/users/courses", userAuth, (req, res) => {
  // logic to list all courses
  res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId", userAuth, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const username = req.headers.username;

  const courseIndex = COURSES.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: "course not found" });
  }

  const userIndex = USERS.findIndex((user) => (user.username = username));

  USERS[userIndex].purchasedCourses.push(COURSES[courseIndex]);

  res.status(200).json({ message: "course purchased successful" });
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const username = req.headers.username;

  const userFound = USERS.find((user) => user.username === username);

  res.status(200).json(userFound.purchasedCourses);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
