const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
app.use(express.json());

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
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

mongoose.connect(
  "mongodb+srv://shivammotani:Temp%40123@cluster0.lrnlzko.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

// Admin routes
const adminSecretKey = "&6ujyMT$!Y#G9ZM";
const userSecretKey = "4242ujyM7$%^2w!Y6j/p0";

const generateAdminJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, adminSecretKey, (err, user) => {
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

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, userSecretKey, (err, user) => {
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

app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.json({ message: "Admin created successfully" });
  } else {
    res.status(403).json({ message: "Admin already exists" });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const existingAdmin = await Admin.findOne({ username, password });
  if (existingAdmin) {
    const token = generateAdminJwt(existingAdmin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const dbCourse = new Course(req.body);
  await dbCourse.save();
  res.json({
    message: "Course created successfully",
    courseId: dbCourse.id,
  });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses: courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "User created successfully" });
  } else {
    res.status(403).json({ message: "User already exists" });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const existingUser = await User.findOne({ username, password });
  if (existingUser) {
    const token = generateUserJwt(existingUser);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  var publishedCourses = await Course.find({ published: true });
  res.json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", authenticateUserJwt, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const usr = await User.findOne({ username: req.user.username });
    if (usr.purchasedCourse.includes(req.params.courseId)) {
      res.status(401).json({ message: "Course already purchased" });
    } else {
      if (course.published) {
        usr.purchasedCourse.push(course);
        await usr.save();
        res.json({ message: "Course purchased successfully" });
      } else {
        res.status(401).json({ message: "Course is not yet published" });
      }
    }
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const usr = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourse"
  );
  if (usr) {
    res.json({ purchasedCourses: usr.purchasedCourse });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
