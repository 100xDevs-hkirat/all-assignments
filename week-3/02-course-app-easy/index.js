const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());
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
  const index = ADMINS.findIndex((item) => item.username == cred.username);
  console.log(index);
  if (index != -1 && ADMINS[index].isAdmin) {
    if (ADMINS[index].password != cred.password) {
      return res.status(404).send("Invalid Password");
    } else {
      const token = jwt.sign(cred, Secret_key, { expiresIn: "1h" });
      res.header("Authorization", `Bearer ${token}`);
      res.status(200).send("Admin logged successfully ");
    }
  } else {
    return res.status(404).send("Such Admin doesn't exist , please signup");
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const detail = {
    id: Math.random(1000) * 1000,
    title: req.body.title,
    description: req.body.description,
    price: req.body.title,
    published: req.body.publish,
  };
  const inToken = req.headers.authorization.split(" ")[1];
  const token = jwt.verify(inToken, Secret_key);
  if (token) {
    const ind = ADMINS.findIndex((item) => item.username == token.username);
    if (ind != -1 && ADMINS[ind].isAdmin) {
      COURSES.push(detail);
      res.status(200).send("Course successfully addedd");
    } else {
      res.status(404).send("sorry Only admin can create the course");
    }
  } else {
    res.status(404).send("Invalid Authentication : Unauthorixed token value");
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const index = COURSES.findIndex((item) => item.id == req.params.id);
  const inToken = req.headers.authorization.split(" ")[1];
  const token = jwt.verify(inToken, Secret_key);
  const updateCourse = {
    id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  };
  if (token) {
    const ind = ADMINS.findIndex((item) => item.username == token.username);
    if (ind != -1 && ADMINS[ind].isAdmin) {
      COURSES[index] = updateCourse;
      return res.status(200).send("Course upated successfully");
    } else {
      return res.status(404).send("Only admin can update the course");
    }
  } else {
    return res.status(404).send("Invalid token value");
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all course
  const inToken = req.headers.authorization.split(" ")[1];
  const token = jwt.verify(inToken, Secret_key);
  if (token) {
    const ind = ADMINS.findIndex((item) => item.username == token.username);
    if (ind != -1 && ADMINS[ind].isAdmin) {
      return res.status(200).send(COURSES);
    } else {
      return res.status(404).send("Only admin can update the course");
    }
  } else {
    return res.status(404).send("Invalid token value");
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
