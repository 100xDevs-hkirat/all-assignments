const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const { ObjectId } = require("mongodb");

app.use(express.json());

const adminSecretKey = "abhi_SECr3t";
const userSecretKey = "abhi_user_SECr3t";

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String },
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

// Define mongoose models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const generateAdminJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

const validateAdminJwtToken = (req, res, next) => {
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

const validateUserJwtToken = (req, res, next) => {
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

// Connect to MongoDB
mongoose.connect("mongodb+srv://abhishekgite446:LMYRcjfl6rVFvsvi@cluster0.klomnx5.mongodb.net/courses", { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

// Admin routes
app.post("/admin/signup", async (req, res) => {
  let admin = req.body;
  const existingAdmin = await Admin.findOne({ username: admin.username });
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username: admin.username, password: admin.password });
    await newAdmin.save();

    let token = generateAdminJwt(newAdmin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  let username = req.headers.username;
  let password = req.headers.password;

  const existingAdmin = await Admin.findOne({ username: username, password: password });

  if (existingAdmin) {
    let token = generateAdminJwt(existingAdmin);
    res.status(201).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", validateAdminJwtToken, async (req, res) => {
  let courseDetails = req.body;
  const course = new Course(courseDetails);
  await course.save();
  res.status(201).json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", validateAdminJwtToken, async (req, res) => {
  let newCourseDetails = req.body;
  let courseId = req.params.courseId;
  let course;
  try {
    course = await Course.findByIdAndUpdate(courseId, newCourseDetails, { new: true });
    console.log(course);
  } catch (error) {
    console.log(error);
  }
  if (course) {
    res.status(201).json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not updated!" });
  }
});

app.get("/admin/courses", validateAdminJwtToken, async (req, res) => {
  let courses = await Course.find({});
  res.status(200).json(courses);
});

// User routes
app.post("/users/signup", async (req, res) => {
  let user = req.body;
  const existingUser = await User.findOne({ username: user.username });
  if (existingUser) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username: user.username, password: user.password });
    await newUser.save();

    let token = generateUserJwt(newUser);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  let user = req.headers;

  const existingUser = await User.findOne({ username: user.username, password: user.password });

  if (existingUser) {
    let token = generateUserJwt(existingUser);
    res.status(201).json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", validateUserJwtToken, async (req, res) => {
  let courses = await Course.find({ published: true });
  res.status(200).json(courses);
});

app.post("/users/courses/:courseId", validateUserJwtToken, async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);

  if (course) {
    const user = await User.findOne({ username: req.user.username }).populate("purchasedCourses");
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

app.get("/users/purchasedCourses", validateUserJwtToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate("purchasedCourses");
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
