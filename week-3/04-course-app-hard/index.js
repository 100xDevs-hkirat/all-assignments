const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const port = 3000;

app.use(express.json());

const SECRET = "da-sekret-key";

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
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

//schemas
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

//models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
mongoose.connect(
  "mongodb+srv://dwiHarsh:harsh411@cluster0.vwmefrc.mongodb.net/courses"
);

// Admin Signup
app.post("/admin/signup", async (req, res) => {
  let { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin) return res.status(403).send();

  let newAdmin = new Admin({ username, password });
  await newAdmin.save();
  const token = jwt.sign({ username, role: "admin" }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ message: "Admin created successfully", token });
});

// Admin Login
app.post("/admin/login", (req, res) => {
  let { username, password } = req.body;

  const admin = Admin.findOne({ username, password });

  if (admin) {
    const token = jwt.sign(
      ({ username, role: "admin" }, SECRET, { expiresIn: "1h" })
    );
    res.json({ message: "Logged in successfullyy", token });
  } else res.status(403).json({ message: "invalid credentials" });
});

//create a course
app.post("/admin/courses", authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await Course.save();
  res.json({ message: "Coourse created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

// Get all courses
app.get("/admin/courses", authenticateJwt, (req, res) => {
  const courses = Course.find({});
  res.json({ courses });
});

// User Signup
app.post("/users/signup", async (req, res) => {
  let { username, password } = req.headers;
  const user = await User.findOne({ username });

  if (user) {
    return res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  }
});

// User Login
app.post("/users/login", (req, res) => {
  let { username, password } = req.body;

  const user = User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else res.status(403).json({ message: "invalid credentials" });
});

// Get all courses
app.get("/users/courses", authenticateJwt, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

//purchase a course by id
app.post("users/courses/:courseId", authenticateJwt, async (req, res) => {
  const course = Course.findById(req.params.courseId);
  if (course) {
    const user = await Course.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else res.status(404).json({ message: "User not found" });
  } else res.status(404).json({ message: "Course not found" });
});

app.get("/user/purchasedCourses", authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else res.status(403).json({ messsage: "User not found" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
