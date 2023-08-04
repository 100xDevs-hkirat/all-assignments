const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const adminSecret = "admin secret";
const userSecret = "user secret";

// Define mongoose schemas
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

// Define mongoose models
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

function generateJWT(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function authenticateJWTAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, adminSecret, (err, admin) => {
      if (err) return res.sendStatus(403);

      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function authenticateJWTUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, userSecret, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

mongoose.connect(
  "mongodb+srv://amulgaurav907:Bkm3vxaN80ucI0p3@cluster0.f2yryxv.mongodb.net/courses",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, adminSecret);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });

  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, adminSecret);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "Admin login failed" });
  }
});

app.post("/admin/courses", authenticateJWTAdmin, async (req, res) => {
  // logic to create a course
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", authenticateJWTAdmin, async (req, res) => {
  // logic to edit a course
  try {
    await Course.findByIdAndUpdate(req.params.courseId, req.body);
    res.json({ message: "Course updated successfully" });
  } catch {
    res.status(404).json({ message: "Course does not exist." });
  }
});

app.get("/admin/courses", authenticateJWTAdmin, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, userSecret);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });

  if (user) {
    const token = jwt.sign({ username, role: "user" }, userSecret);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "User login failed" });
  }
});

app.get("/users/courses", authenticateJWTUser, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJWTUser, async (req, res) => {
  // logic to purchase a course
  try {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findOne({ username: req.user.username });

    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch {
    res.status(404).json({ message: "Course not exists" });
  }
});

app.get("/users/purchasedCourses", authenticateJWTUser, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );

  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: "User does not exist" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
