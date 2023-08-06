const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config()
const app = express();
app.use(express.json());
const PORT = 3000;
const SECRET = "mysupersecretvalue";
const MONGODBURI = process.env.MONGODBURI;

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.status(403).send("Unauthorized");
      }
      req.payload = payload;
      next();
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

mongoose.connect(MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    return res.status(400).send("Bad request");
  }
  const newAdmin = new Admin({ username, password });
  newAdmin.save();
  const token = jwt.sign({ username, role: "admin" }, SECRET, {
    expiresIn: "1h",
  });
  return res.status(201).send({ message: "Admin created successfully", token });
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).send({
      message: "Logged in successfully",
      token,
    });
  }
  return res.status(400).send("Bad request");
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  return res.json({
    message: "Course created successfully",
    courseId: course.id,
  });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  return res.status(200).send(courses);
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(400).send("Bad request");
  }
  const newUser = new User({ username, password });
  newUser.save();
  const token = jwt.sign({ username, role: "user" }, SECRET, {
    expiresIn: "1h",
  });
  return res.status(201).send({ message: "User created successfully", token });
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).send({
      message: "Logged in successfully",
      token,
    });
  }
  return res.status(400).send("Bad request");
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  return res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const username = req.payload.username;
  const course = await Course.findById(courseId);
  if (course) {
    const user = await User.findOne({ username: username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      return res.status(200).send({ message: "Course purchased successfully" });
    } else {
      return res.status(409).send(`User with username = ${username} not found`);
    }
  } else {
    return res
      .status(409)
      .send(`Course with courseId = ${courseId} not found!`);
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const username = req.payload.username;
  const user = await User.findOne({ username: username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.status(200).send({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    return res.status(409).send(`User with username = ${username} not found`);
  }
});

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});

// module.exports = app;
