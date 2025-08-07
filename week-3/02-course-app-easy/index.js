const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authentication = require(__dirname + "/middleware/authentication");

const jwtKey = "C@nBi-WWKTVZywQ4QNv.";

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let adminId = 1;
let courseId = 1;
let userId = 1;

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  try {
    const { username, password } = req.body;
    const { _, exists } = await checkIfExists(ADMINS, {
      username,
      password,
    });
    if (exists)
      return res.status(400).send({ message: "Admin already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = { id: adminId, username, password: hashedPassword };
    if (ADMINS.length === 0) ADMINS[0] = admin;
    else ADMINS = [...ADMINS, admin];
    adminId++;
    return res.status(201).send({ message: "Admin created successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Failed to signup due to the error: ${err}` });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  try {
    const { user, exists } = await checkIfExists(ADMINS, { ...req.headers });
    if (!exists)
      return res.status(401).send({ message: "Authentication failed" });
    const token = jwt.sign({ userId: user.adminId }, jwtKey, {
      expiresIn: "1h",
    });
    return res.status(200).send({ message: "Logged in successfully", token });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Logged in failed with error: ${err}` });
  }
});

app.post("/admin/courses", authentication, (req, res) => {
  try {
    // logic to create a course
    const course = { courseId, ...req.body };
    if (COURSES.length === 0) COURSES = [course];
    else COURSES = [...COURSES, course];
    courseId++;
    return res.status(200).send({
      message: "Course created successfully",
      courseId: course.courseId,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Course creation failed with error: ${err} ` });
  }
});

app.put("/admin/courses/:courseId", authentication, (req, res) => {
  // logic to edit a course
  try {
    const courseId = +req.params.courseId;
    const updateCourse = { courseId, ...req.body };
    COURSES = [
      ...COURSES.filter((course) => course.courseId !== courseId),
      updateCourse,
    ];
    res.status(200).send({ message: "Course updated successfully" });
  } catch (error) {
    return res.status(500).send({
      message: `Failed to update course with courseId: ${+req.params
        .courseId} with error: ${error}`,
    });
  }
});

app.get("/admin/courses", authentication, (req, res) => {
  // logic to get all courses
  try {
    res.status(200).send({ courses: COURSES });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Failed to get all courses with error: ${error}` });
  }
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  try {
    const { username, password } = req.body;
    const { _, exists } = await checkIfExists(USERS, { username, password });
    if (exists) return res.status(400).send({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: userId, username, password: hashedPassword };
    if (USERS.length == 0) USERS[0] = user;
    else USERS = [...USERS, user];
    userId++;

    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Signup failed with error: ${error}` });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  try {
    const { user, exists } = await checkIfExists(USERS, { ...req.headers });
    if (!exists)
      return res.status(400).send({ message: "Authentication failed" });
    const token = jwt.sign({ userId: user.userId }, jwtKey, {
      expiresIn: "1h",
    });
    return res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Login failed with error: ${error}` });
  }
});

app.get("/users/courses", authentication, (req, res) => {
  // logic to list all courses
  try {
    return res.status(200).send({ courses: COURSES });
  } catch (error) {
    return res.status(500).send({
      message: `Request to get all courses failed with error: ${error}`,
    });
  }
});

app.post("/users/courses/:courseId", authentication, (req, res) => {
  // logic to purchase a course
  try {
    const courseId = +req.params.courseId;
    const course = COURSES.find((course) => +course.courseId === courseId);
    if (!course)
      return res.status(400).send({
        message: "Unable to purchase course as course does not exist",
      });
    course.purchased = true;
    COURSES = [
      ...COURSES.filter((course) => +course.courseId !== courseId),
      course,
    ];
    return res.status(200).send({ message: "Course purchased successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Failed to get course with error ${error}` });
  }
});

app.get("/users/purchasedCourses", authentication, (req, res) => {
  // logic to view purchased courses
  try {
    const purchasedCourses = COURSES.filter((course) => course.purchased);
    return res.status(200).send(purchasedCourses);
  } catch (error) {
    return res.status(500).send({
      message: `Failed to get purchased courses with error: ${error}`,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

const checkIfExists = async (arr, { username, password }) => {
  const user = arr.find((user) => user.username === username);
  //console.log(`User: ${JSON.stringify(user)}`);
  if (!user) return { user, exists: false };
  const passwordMatch = await bcrypt.compare(password, user.password);
  return { user, exists: passwordMatch };
};
