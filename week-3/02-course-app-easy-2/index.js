const express = require("express");
//const bodyparser = require("body-parser");
const app = express();
//const fs = require("fs");
app.use(express.json());
const jwt = require("jsonwebtoken");

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "r!ddlEm3";

const generateToken = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let admin = req.body;

  if (ADMINS.findIndex((ad) => ad.username === admin.username) != -1) {
    return res.status(409).send("User id already exists");
  }

  ADMINS.push(admin);
  const token = generateToken(admin);
  //writeData("ADMINS.txt", ADMINS);
  return res.status(200).json({ message: "Admin created successfully", token });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  let { username, password } = req.headers;
  const admin = ADMINS.find(
    (adm) => adm.username === username && adm.password === password
  );

  if (admin) {
    token = generateToken(admin);
    //console.log(token);
    return res
      .status(200)
      .json({ message: "User looged in successfully", token });
  }
  return res.status(403).json({ message: "Authentication failed" });
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  //Body: { title: 'course title', description: 'course description',
  //price: 100, imageLink: 'https://linktoimage.com', published: true }

  let course = req.body;
  if (course) {
    course.courseId = COURSES.length + 1;
    COURSES.push(course);
    //writeData("COURSES.txt", COURSES);
  }

  res.status(200).json({
    message: "Course created successfully",
    courseId: course.courseId,
  });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  //Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink:
  //'https://updatedlinktoimage.com', published: false }
  //Output: { message: 'Course updated successfully' }
  // logic to edit a course

  let course = req.body;
  let courseId = req.params.courseId;
  let courseIndex = COURSES.findIndex((course) => course.courseId == courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  Object.assign(COURSES[courseIndex], course);
  /* COURSES[courseIndex].title = course.title;
  COURSES[courseIndex].description = course.description;
  COURSES[courseIndex].price = course.price;
  COURSES[courseIndex].imageLink = course.imageLink;
  COURSES[courseIndex].published = course.published; */

  return res.status(200).json({ message: "Course updated successfully" });
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  return res.status(200).json(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user

  let user = req.body;

  if (USERS.findIndex((usr) => usr.username === user.username) != -1) {
    return res.status(409).json({ message: "User id already exists" });
  }
  user.purchasedCourses = [];
  console.log(user);
  USERS.push(user);
  console.log(USERS);
  let token = generateToken(user);
  //writeData("USERS.txt", USERS);
  return res.status(200).json({ message: "User created successfully", token });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;

  const user = USERS.find(
    (usr) => usr.username === username && usr.password === password
  );

  if (user) {
    let token = generateToken(user);
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } else {
    res.status(403).json({ message: "User Authenticatoin failed" });
  }
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  // logic to list all courses
  return res.status(200).json(COURSES.filter((course) => course.published));
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to purchase a course
  //let course = req.body;
  let courseId = req.params.courseId;

  let courseIndex = COURSES.findIndex((course) => course.courseId == courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  let userIndex = USERS.findIndex(
    (user) => user.username === req.user.username
  );
  //console.log("index " + userIndex + " user  " + USERS[userIndex]);
  USERS[userIndex].purchasedCourses.push(COURSES[courseIndex].courseId);
  //console.log("USERS " + JSON.stringify(USERS[userIndex]));
  //writeData("USERS.txt", USERS);
  return res.status(200).json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  // logic to view purchased courses
  return res
    .status(200)
    .json(
      USERS[
        USERS.findIndex((user) => user.username === req.user.username)
      ].purchasedCourses.map((courseId) =>
        COURSES.find((course) => course.courseId === courseId)
      )
    );
});

app.listen(3000, () => {
  console.log("Server is listening on port: 3000");
});
