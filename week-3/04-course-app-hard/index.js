const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("../04-course-app-hard/models/User");
const Admin = require("../04-course-app-hard/models/Admin");
const Course = require("../04-course-app-hard/models/Course");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db!");
  });

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).send({ message: "Admin already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    const acessToken = jwt.sign(
      { username, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.send({ message: "Admin created sucessfully", token: acessToken });
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username });
  if (admin) {
    const validPass = await bcrypt.compare(password, admin.password);
    if (validPass) {
      const acessToken = jwt.sign(
        { username, role: "admin" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ message: "Admin logged in sucessfully", token: acessToken });
    } else {
      res.status(403).send({ message: "Invalid password!" });
    }
  } else {
    res.status(403).send({ message: "Admin not found" });
  }
});

app.get("/admin/me", authenticateToken, (req, res) => {
  res.json(req.user.username);
});

app.post("/admin/courses", authenticateToken, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateToken, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log("here");
  if (course) {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
      }
    );
    res.json({ message: "Course updated successfully", updatedCourse });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateToken, async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(404).send({ message: "User already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const acessToken = jwt.sign(
      { username, role: "user" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.send({ message: "User created sucessfully", token: acessToken });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username });
  if (user) {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      const acessToken = jwt.sign(
        { username, role: "user" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ message: "User logged in sucessfully", token: acessToken });
    } else {
      res.status(403).send({ message: "Invalid password!" });
    }
  } else {
    res.status(403).send({ message: "User not found!" });
  }
});

app.get("/users/courses", authenticateToken, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateToken, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
