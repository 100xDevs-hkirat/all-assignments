const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());

const ADMIN_FILE = path.join(__dirname, "ADMINS.json");
const USER_FILE = path.join(__dirname, "USERS.json");
const COURSE_FILE = path.join(__dirname, "COURSES.json");
const COURSE_PURCHASES_FILE = path.join(__dirname, "COURSE_PURCHASES.json");

// Admin Signup
app.post("/admin/signup", (req, res) => {
  let adminData = req.body;

  fs.readFile(ADMIN_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let admins = JSON.parse(data);

    let adminExists = admins.some(
      (admin) => admin.username === adminData.username
    );

    if (adminExists) return res.status(409).send();

    admins.push(adminData);

    fs.writeFile(ADMIN_FILE, JSON.stringify(admins), (err) => {
      if (err) return res.status(500).send();

      return res.status(201).send();
    });
  });
});

// Admin Login
app.post("/admin/login", (req, res) => {
  let adminData = req.body;

  fs.readFile(ADMIN_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let admins = JSON.parse(data);

    let admin = admins.find(
      (admin) =>
        admin.username === adminData.username &&
        admin.password === adminData.password
    );

    if (!admin) return res.status(403).send();

    return res.status(200).send();
  });
});

// Get all courses
app.get("/admin/courses", (req, res) => {
  fs.readFile(COURSE_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let courses = JSON.parse(data);

    return res.json(courses);
  });
});

// Get a specific course
app.get("/admin/courses/:courseId", (req, res) => {
  let courseId = req.params.courseId;

  fs.readFile(COURSE_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let courses = JSON.parse(data);

    let course = courses.find((course) => course.id === courseId);

    if (!course) return res.status(404).send();

    return res.json(course);
  });
});

// User Signup
app.post("/users/signup", (req, res) => {
  let userData = req.body;

  fs.readFile(USER_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let users = JSON.parse(data);

    let userExists = users.some((user) => user.username === userData.username);

    if (userExists) return res.status(409).send();

    users.push(userData);

    fs.writeFile(USER_FILE, JSON.stringify(users), (err) => {
      if (err) return res.status(500).send();

      return res.status(201).send();
    });
  });
});

// User Login
app.post("/users/login", (req, res) => {
  let userData = req.body;

  fs.readFile(USER_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let users = JSON.parse(data);

    let user = users.find(
      (user) =>
        user.username === userData.username &&
        user.password === userData.password
    );

    if (!user) return res.status(403).send();

    return res.status(200).send();
  });
});

// Get all purchased courses for a user
app.get("/users/purchasedCourses", (req, res) => {
  let userId = req.query.userId;

  fs.readFile(COURSE_PURCHASES_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let coursePurchases = JSON.parse(data);

    let userCourses = coursePurchases.filter(
      (purchase) => purchase.userId === userId
    );

    let courseIds = userCourses.map((purchase) => purchase.courseId);

    fs.readFile(COURSE_FILE, "utf-8", (err, data) => {
      if (err) return res.status(500).send();

      let courses = JSON.parse(data);

      let purchasedCourses = courses.filter((course) =>
        courseIds.includes(course.id)
      );

      return res.json(purchasedCourses).status(200);
    });
  });
});

// Purchase a course
app.post("/users/courses/:courseId", (req, res) => {
  let courseId = req.params.courseId;
  let userId = req.query.userId;

  fs.readFile(COURSE_PURCHASES_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).send();

    let coursePurchases = JSON.parse(data);

    let purchaseExists = coursePurchases.some(
      (purchase) => purchase.userId === userId && purchase.courseId === courseId
    );

    if (purchaseExists) return res.status(409).send();

    let purchaseData = { userId, courseId };

    coursePurchases.push(purchaseData);

    fs.writeFile(
      COURSE_PURCHASES_FILE,
      JSON.stringify(coursePurchases),
      (err) => {
        if (err) return res.status(500).send();

        return res.status(201).send();
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
