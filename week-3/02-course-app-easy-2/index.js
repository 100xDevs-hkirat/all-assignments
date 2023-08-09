const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;
require("dotenv").config();

const DB_LINK = process.env.DB_LINK;

app.use(cors());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// mongoose schema

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
  prices: Number,
  imageLink: String,
  published: Boolean,
});

// mongoose collection

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

// connect to mongoDB
mongoose.connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("connected", () => {
  console.log("db connected");
});

app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

const secretKey = "secR3T";

const generateToken = (user) => {
  const payload = { user: user.username };
  return jwt.sign(payload, secretKey);
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403).send(err);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(404);
  }
};

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (e) => e.username === username && e.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, password }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin signup successful", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, secretKey, {
      expiresIn: "1hr",
    });
    res.json({ message: "Admin logged in successfully", token });
  } else {
    res.status(403).send({ message: "Admin login failed" });
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: " Course updated succesfully" });
  } else {
    res.status(400).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, async(req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.headers;
  const user = await Course.findOne({ username, password });
  if (user) {
    res.json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "User logged in successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to login user
  const { username, password } = req.headers;
  const user = await User.findOne({ username });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "User logged in succesfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed", token });
  }
});

app.get("/users/courses", authenticateJwt, async(req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, async(req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (course) {
    // console.log(User);
    const user = await User.findOne({ username: req.headers.username });
    // console.log(req.headers);
    if (user) {
      user.purchasedCourses.push(course)
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async(req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses')
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || []});
  } else {
    res.status(403).json({ message: "No courses purchased" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port - ${PORT}`);
});
