import express, { json } from "express";
import jwt from "jsonwebtoken";
import { default as mongoose } from "mongoose";

const app = express();
const { verify, sign } = jwt;
app.use(json());

const SECRET = "my-app-secret";

//Collection schema
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

//Define mongoose models ................................................................
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

const authenticateJWT = (req, res, next) => {
  const authUser = req.headers.authorization;
  if (authUser) {
    const token = authUser.split(" ")[1];
    verify(token, secret, (err, result) => {
      if (err) res.status(403).send();
      req.user = result;
      next();
    });
  } else res.status(401).send();
};

//Connect to mongodb
mongoose.connect(
  "mongodb+srv://mrkirthi:mrkirthi@cluster0.aonurvc.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) res.status(403).json({ message: "Admin already exists" });
  else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ message: "Admin account created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;
  const existingAdmin = Admin.findOne({ username, password });
  if (existingAdmin) {
    const token = sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "LoggedIn successfully", token });
  } else res.status(401).send();
});

app.post("/admin/courses", authenticateJWT, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course saved successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJWT, async (req, res) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    {
      new: true,
    }
  );
  if (updatedCourse) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJWT, (req, res) => {
  const courses = Course.find({});
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.get("/users/courses", authenticateJWT, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJWT, async (req, res) => {
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

app.get("/users/purchasedCourses", authenticateJWT, async (req, res) => {
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
