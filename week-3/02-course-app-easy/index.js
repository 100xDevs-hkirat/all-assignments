const express = require("express");
const app = express();
const { Admin, Course , User} = require("./models/");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const config = require("config");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;

  //Check if username/email already taken
  const checkTaken = ADMINS.find((admin) => admin.username === username);
  if (checkTaken) {
    return res.json({ msg: "Username / Email already taken" });
  }
  const newAdmin = new Admin(username, password);
  ADMINS.push(newAdmin.getDetails());
  const payload = { user: newAdmin.getDetails().id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;

  //Check if user is registered
  const admin = ADMINS.find((admin) => admin.username === username);
  if (!admin) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
  if (admin.password === password) {
    const payload = { user: admin.id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  }
});

app.post("/admin/courses", auth, (req, res) => {
  const {title, description, price, imgLink, published} = req.body;
  const newCourse = new Course(title, description, price, imgLink, published,req.user);
  COURSES.push(newCourse.getDetails());
  res.status(200).json({msg : "Published a new course"})
});

app.put("/admin/courses/:courseId", auth , (req, res) => {
  const adminCourses = COURSES.filter(course => course.user.userID === req.user);
  const courseIndex = COURSES.findIndex(course => course.id === String(req.params.courseId));
  COURSES[courseIndex] = {
    ...req.body,
    user: COURSES[courseIndex].user
  }
  res.status(200).json({msg: "Updated the course"});
});

app.get("/admin/courses", auth,(req, res) => {
  const adminCourses = COURSES.filter(course => course.user.userID === req.user);
  res.json(adminCourses);
});


// -------------------------------------------------------------------------------------
// User routes

app.post("/users/signup", (req, res) => {

  const { username, password } = req.body;

  //Check if username/email already taken
  const checkTaken = USERS.find((user) => user.username === username);
  if (checkTaken) {
    return res.json({ msg: "Username / Email already taken" });
  }
  const newUser = new User(username, password);
  USERS.push(newUser.getDetails());
  const payload = { user: newUser.getDetails().id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;

  //Check if user is registered
  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
  if (user.password === password) {
    const payload = { user: user.id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  }
});

app.get("/users/courses", auth,(req, res) => {
  res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId",auth ,(req, res) => {
  const course = COURSES.find(course => course.id === String(req.params.courseId));
  const userInd = USERS.findIndex(user => user.id === req.user);
  USERS[userInd].courses.push(course);
  res.send({msg : "Bought the course"});
});

app.get("/users/purchasedCourses", auth,(req, res) => {
  const user = USERS.find(user => user.id === req.user);
  const courses = user.courses;
  res.status(200).json(courses);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
