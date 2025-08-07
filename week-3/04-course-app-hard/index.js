const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const authentication = require(__dirname + "/middleware/authentication");

const jwtKey = "C@nBi-WWKTVZywQ4QNv.";

const bcrypt = require("bcrypt");

const uri = "mongodb://usernm:pwd@localhost:27017/?authSource=admin";

const client = new MongoClient(uri);

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", async (req, res) => {
  try {
    const db = client.db("course_app");
    const admins = db.collection("admins");
    const adminsList = await admins.find({}).toArray();

    // logic to sign up admin
    const { username, password } = req.body;
    const { _, exists } = await checkIfExists(adminsList, {
      username,
      password,
    });
    if (exists)
      return res.status(400).send({ message: "Admin already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const record = { username, password: hashedPassword };
    await admins.insertOne(record);
    return res.status(201).send({ message: "Admin created successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Failed to signup with error: ${err}` });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  try {
    const db = client.db("course_app");
    const admins = db.collection("admins");
    const adminList = await admins.find({}).toArray();

    const { user, exists } = await checkIfExists(adminList, { ...req.headers });
    if (!exists)
      return res.status(401).send({ message: "Authentication failed" });
    const token = jwt.sign({ id: user._id }, jwtKey, { expiresIn: "1h" });
    return res.status(200).send({ message: "Logged in successfully", token });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Failed to login with error: ${err}` });
  }
});

app.post("/admin/courses", authentication, async (req, res) => {
  // logic to create a course
  try {
    const db = client.db("course_app");
    const courses = db.collection("courses");

    const response = await courses.insertOne(req.body);

    return res.status(200).send({
      message: "Course created successfully",
      courseId: response.insertedId,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Course creation failed with error: ${error}` });
  }
});

app.put("/admin/courses/:courseId", authentication, async (req, res) => {
  try {
    // logic to edit a course
    const courseId = req.params.courseId;
    const db = client.db("course_app");
    const courses = db.collection("courses");

    const _id = new ObjectId(courseId);

    const course = req.body;

    await courses.updateOne(
      { _id: _id },
      {
        $set: {
          title: course.title,
          description: course.description,
          price: course.price,
          imageLink: course.imageLink,
          published: course.published,
        },
      }
    );

    return res.status(200).send({ message: "Course updated successfully" });
  } catch (error) {
    return res.status(500).send({
      message: `Failed to update course with courseId: ${req.params.courseId} with error: ${error}`,
    });
  }
});

app.get("/admin/courses", authentication, async (req, res) => {
  // logic to get all courses
  try {
    const db = client.db("course_app");
    const courses = db.collection("courses");
    const data = await courses.find({}).toArray();

    return res.status(200).send({ courses: data });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Request to get courses failed with error: ${error}` });
  }
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  try {
    const { username, password } = req.body;

    const db = client.db("course_app");
    const users = db.collection("users");

    const usersList = await users.find({}).toArray();
    const { user, exists } = checkIfExists(usersList, { username, password });
    if (exists) return res.status(401).send({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const record = { username, password: hashedPassword };

    await users.insertOne(record);

    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Failed to create user with error: ${error}` });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  try {
    const db = client.db("course_app");
    const users = db.collection("users");

    const usersList = await users.find({}).toArray();

    const { user, exists } = await checkIfExists(usersList, { ...req.headers });
    if (!exists)
      return res.status(401).send({ message: "Authentication Failed" });

    const token = jwt.sign({ id: user._id }, jwtKey, { expiresIn: "1h" });
    return res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Failed to login with error: ${error}` });
  }
});

app.get("/users/courses", authentication, async (req, res) => {
  // logic to list all courses
  try {
    const db = client.db("course_app");
    const courses = db.collection("courses");

    const coursesList = await courses.find({}).toArray({});
    return res.status(200).send({ courses: coursesList });
  } catch (error) {
    return res.status(500).send({ message: "Failed to get courses" });
  }
});

app.post("/users/courses/:courseId", authentication, async (req, res) => {
  try {
    // logic to purchase a course
    const db = client.db("course_app");
    const courses = db.collection("courses");

    const _id = new ObjectId(req.params.courseId);

    await courses.updateOne({ _id }, { $set: { purchased: true } });
    return res.status(200).send({ message: "Course updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Failed to get course with error: ${error}` });
  }
});

app.get("/users/purchasedCourses", authentication, async (req, res) => {
  try {
    // logic to view purchased courses
    const db = client.db("course_app");
    const courses = db.collection("courses");

    const purchasedCourses = await courses.find({ purchased: true }).toArray();
    return res.status(200).send({ purchasedCourses });
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
  if (!user) return { user, exists: false };
  const passwordMatch = await bcrypt.compare(password, user.password);
  return { user, exists: passwordMatch };
};
