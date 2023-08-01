const express = require("express");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const app = express();
const secret = "S3cr3tIsThisYouKnowna";

// Defining mongoose Schema
const userSchema = Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = Schema({
  username: String,
  password: String,
});

const courseSchema = Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

// Defining mongoose models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose
  .connect("mongodb://127.0.0.1:27017/Courses", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("MongoDB connection started");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exist." });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, secret, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const admin = req.headers;
  if (
    await Admin.findOne({ username: admin.username, password: admin.password })
  ) {
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      secret,
      {
        expiresIn: "1h",
      }
    );
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post("/admin/courses", adminAuthenticateJWT, async (req, res) => {
  // logic to create a course
  const course = req.body;
  const newCourse = new Course(course);
  await newCourse.save();
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", adminAuthenticateJWT, async (req, res) => {
  // logic to edit a course
  try {
    const id = req.params.courseId;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedCourse) {
      return res.json({ message: "Course updated successfully" });
    } else {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

app.get("/admin/courses", adminAuthenticateJWT, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find();
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(403).json({ message: "User already exist." });
  }
  const newUser = new User({ username, password });
  await newUser.save();
  const token = jwt.sign({ username, role: "user" }, secret);
  res.json({ message: "User created successfully", token });
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  if (!(await User.findOne({ username, password }))) {
    return res.sendStatus(403);
  }
  const token = jwt.sign({ username, role: "user" }, secret);
  res.json({ message: "Logged in successfully", token });
});

app.get("/users/courses", userAuthenticateJWT, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", userAuthenticateJWT, async (req, res) => {
  // logic to purchase a course
  const id = req.params.courseId;
  const { username } = req.user;
  const user = await User.findOne({ username });
  const course = await Course.findById(id);

  if (!user) {
    return res.status(403).json({ message: "User doesn't exist." });
  } else if (!course) {
    return res.status(404).json({ message: "Course not fouond" });
  }

  user.purchasedCourses.push(course);
  await user.save();
  res.json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", userAuthenticateJWT, async (req, res) => {
  // logic to view purchased courses
  const { username } = req.user;
  const user = await User.findOne({ username }).populate("purchasedCourses");
  if (user) {
    return res.json({ purchasedCourses: user.purchasedCourses || [] });
  }
  res.status(403).json({ message: "User not found" });
});

function adminAuthenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization Token is missing" });
  }
  jwt.verify(token, secret, (err, admin) => {
    if (err || admin.role != "admin") {
      return res.status(401).json({ error: "Admin no longer exists." });
    }
    next();
  });
}

function userAuthenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization Token is missing" });
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "User no longer exists." });
    }
    req.user = user;
    next();
  });
}
