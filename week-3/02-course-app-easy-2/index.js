const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
console.log(COURSES);
let courseId = 100;

const generateToken = (username) => {
  const secretkey = "this_is_my_secret_key";
  const token = jwt.sign({ username: username }, secretkey, {
    expiresIn: "1h",
  });
  return token;
};

const verifyToken = (req, res, next) => {
  const givenToken = req.header("Authorization").replace("Bearer ", "");
  const secretkey = "this_is_my_secret_key";
  try {
    const payload = jwt.verify(givenToken, secretkey);
    req.username = payload.username;
  } catch (e) {
    res.send("plaese authenticate");
  }

  next();
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const isExisted = ADMINS.find((user) => user.username == username);
  if (!isExisted) {
    const token = generateToken(username);
    ADMINS.push({ username, password, tokens: [token] });
    res.send({ message: "admin created successfully", token });
  } else res.send("user already existed");
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isExisted = ADMINS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    const token = generateToken(username);
    res.send({ message: "logged in successfully", token });
  } else res.status(401).send("invalid credentials");
});

app.post("/admin/courses", verifyToken, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  COURSES.push({
    courseId: courseId,
    title,
    description,
    price,
    imageLink,
    published,
  });

  res.send({ message: "course created successfully", courseId });
  courseId++;
});

app.put("/admin/courses/:courseId", verifyToken, (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const getCourse = COURSES.find(
    (course) => course.courseId === Number(courseId)
  );
  console.log(getCourse);
  if (getCourse) {
    const keys = Object.keys(getCourse);
    for (let key of keys) {
      getCourse[key] = req.body[key];
    }
  }
  console.log(COURSES);
  res.send({ message: "course updated successfully", course: getCourse });
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  res.send({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const isExisted = USERS.find((user) => user.username == username);
  if (!isExisted) {
    const token = generateToken(username);
    USERS.push({ username, password, coursesPurchased: [], tokens: [token] });
    res.send({ message: "user created successfully", token });
  } else res.send("user already existed");
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const isExisted = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    const token = generateToken(username);
    res.send({ message: "logged in successfully", token });
  } else res.status(401).send("invalid credentials");
});

app.get("/users/courses", verifyToken, (req, res) => {
  // logic to list all courses
  const isUserExisted = USERS.find((user) => user.username === req.username);
  if (isUserExisted) res.send({ courses: COURSES });
  else res.send("please sign up to view courses");
});

app.post("/users/courses/:courseId", verifyToken, (req, res) => {
  // logic to purchase a course
  const isUserExisted = USERS.find((user) => user.username === req.username);
  if (isUserExisted) {
    const course = COURSES.find(
      (course) => course.courseId === req.params.courseId
    );
    if (course) {
      if (
        !isUserExisted.coursesPurchased.includes(Number(req.params.courseId))
      ) {
        isExisted.coursesPurchased.push(req.params.courseId);
        res.send({ course: course });
      } else {
        res.send("course already bought");
      }
    }
  } else res.send("please sign up to view courses");
});

app.get("/users/purchasedCourses", verifyToken, (req, res) => {
  // logic to view purchased courses
  const isUserExisted = USERS.find((user) => user.username === req.username);
  if (isUserExisted) res.send(isUserExisted);
  else res.send("please sign up to view courses");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
