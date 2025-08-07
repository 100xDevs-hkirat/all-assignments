const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

const admin = __dirname + "/files/admin.json";
const course = __dirname + "/files/course.json";
const purchase = __dirname + "/files/purchase.json";
const userFile = __dirname + "/files/user.json";

const authentication = require(__dirname + "/middleware/authentication");

const jwtKey = "C@nBi-WWKTVZywQ4QNv.";

const app = express();

app.use(express.json());

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  try {
    const data = await readFile(admin);
    let ADMINS;
    if (!data) ADMINS = [];
    else ADMINS = JSON.parse(data);

    let adminId =
      ADMINS.length === 0 ? 1 : Math.max(...ADMINS.map((item) => item.id)) + 1;

    const { username, password } = req.body;
    const { _, exists } = await checkIfExists(ADMINS, {
      username,
      password,
    });
    if (exists)
      return res.status(400).send({ message: "Admin already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const record = { id: adminId, username, password: hashedPassword };
    if (ADMINS.length === 0) ADMINS[0] = record;
    else ADMINS = [...ADMINS, record];

    await writeFile(admin, JSON.stringify(ADMINS, null, 2));

    return res.status(201).send({ message: "Admin created successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: `Failed to signup due to the error: ${err}` });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  try {
    const data = await readFile(admin);
    let ADMINS;
    if (!data) ADMINS = [];
    else ADMINS = JSON.parse(data);

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

app.post("/admin/courses", authentication, async (req, res) => {
  try {
    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

    let courseId =
      COURSES.length === 0
        ? 1
        : Math.max(...COURSES.map((item) => item.courseId)) + 1;

    // logic to create a course
    const record = { courseId, ...req.body };
    if (COURSES.length === 0) COURSES = [record];
    else COURSES = [...COURSES, record];

    await writeFile(course, JSON.stringify(COURSES, null, 2));

    return res.status(200).send({
      message: "Course created successfully",
      courseId: record.courseId,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Course creation failed with error: ${err} ` });
  }
});

app.put("/admin/courses/:courseId", authentication, async (req, res) => {
  // logic to edit a course
  try {
    const courseId = +req.params.courseId;
    const updateCourse = { courseId, ...req.body };

    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

    COURSES = [
      ...COURSES.filter((course) => course.courseId !== courseId),
      updateCourse,
    ];

    await writeFile(course, JSON.stringify(COURSES, null, 2));
    res.status(200).send({ message: "Course updated successfully" });
  } catch (error) {
    return res.status(500).send({
      message: `Failed to update course with courseId: ${+req.params
        .courseId} with error: ${error}`,
    });
  }
});

app.get("/admin/courses", authentication, async (req, res) => {
  // logic to get all courses
  try {
    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

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
    const data = await readFile(userFile);
    let USERS;
    if (!data) USERS = [];
    else USERS = JSON.parse(data);

    let userId =
      USERS.length === 0 ? 1 : Math.max(...USERS.map((item) => item.id)) + 1;

    const { username, password } = req.body;
    const { _, exists } = await checkIfExists(USERS, { username, password });
    if (exists) return res.status(400).send({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const record = { id: userId, username, password: hashedPassword };
    if (USERS.length == 0) USERS[0] = record;
    else USERS = [...USERS, record];

    await writeFile(userFile, JSON.stringify(USERS, null, 2));

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
    const data = await readFile(userFile);
    let USERS;
    if (!data) USERS = [];
    else USERS = JSON.parse(data);

    const { user, exists } = await checkIfExists(USERS, { ...req.headers });
    if (!exists)
      return res.status(400).send({ message: "Authentication failed" });
    const token = jwt.sign({ userId: user.id }, jwtKey, {
      expiresIn: "1h",
    });
    return res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Login failed with error: ${error}` });
  }
});

app.get("/users/courses", authentication, async (req, res) => {
  // logic to list all courses
  try {
    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

    return res.status(200).send({ courses: COURSES });
  } catch (error) {
    return res.status(500).send({
      message: `Request to get all courses failed with error: ${error}`,
    });
  }
});

app.post("/users/courses/:courseId", authentication, async (req, res) => {
  // logic to purchase a course
  try {
    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

    const purchaseData = await readFile(purchase);
    let PURCHASES;
    if (!purchaseData) PURCHASES = [];
    else PURCHASES = JSON.parse(purchaseData);

    const courseId = +req.params.courseId;
    const record = COURSES.find((course) => +course.courseId === courseId);
    if (!record)
      return res.status(400).send({
        message: "Unable to purchase course as course does not exist",
      });
    record.purchased = true;
    COURSES = [
      ...COURSES.filter((course) => +course.courseId !== courseId),
      record,
    ];

    PURCHASES = [...PURCHASES, record];

    await writeFile(course, JSON.stringify(COURSES, null, 2));
    await writeFile(purchase, JSON.stringify(PURCHASES, null, 2));
    return res.status(200).send({ message: "Course purchased successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: `Failed to get course with error ${error}` });
  }
});

app.get("/users/purchasedCourses", authentication, async (req, res) => {
  // logic to view purchased courses
  try {
    const data = await readFile(course);
    let COURSES;
    if (!data) COURSES = [];
    else COURSES = JSON.parse(data);

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

const writeFile = async (filename, data) => {
  try {
    await fs.writeFile(filename, data, "utf8");
  } catch (error) {
    throw error;
  }
};

const readFile = async (filename) => {
  try {
    return await fs.readFile(filename, "utf8");
  } catch (error) {
    throw error;
  }
};
