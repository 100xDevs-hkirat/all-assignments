const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/course-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Suppress strictQuery warning
mongoose.set("strictQuery", false);
const db = mongoose.connection;

// Check for connection error
db.on("error", console.error.bind(console, "connection error:"));

// Log success message on successful connection
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.use(express.json());

const secret = "Secret";

// Creating the Schema

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  puchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
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

// Creating the modles

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user = user;
        console.log(user);
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, { expiresIn: "1hr" });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  Admin.findOne({ username }).then((admin) => {
    if (admin) {
      res.status(403).json({ message: "Admin already exists." });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = generateJwt(obj);
      res.json({ message: "Admins created successfully.", token });
    }
  });
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = generateJwt(admin);
    res.json({ message: "User login successfully.", token: token });
  } else {
    res.status(403).json({ error: "Invalid username or password." });
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  const newCourse = new Course(req.body);
  console.log(newCourse);
  await newCourse.save();
  res.json({ message: "Course created successfully." });
});

app.put("/admin/courses/:courseId", async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully." });
  } else {
    res.json({ error: "Course not found." });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.status(403).json({ error: "User already exist." });
  } else {
    const obj = { username, password };
    const newUser = new User(obj);
    newUser.save();
    token = generateJwt(obj);
    res.json({ message: "User created successfully.", token: token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = generateJwt(user);
    res.json({ message: "Successfuly login as a user", token: token });
  } else {
    res.json({ err: "username or password does not match." });
  }
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course

  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    console.log(req.user.username);
    const user = await User.findOne({username:req.user.username});
    if (user) {
      await user.save();
      res.json({ message: "Course purchased successfully." });
    }
    else{
      res.json({error:"user not found."});
    }
  } else {
    res.json({ message: "course not found." });
  }
});

app.get("/users/purchasedCourses",authenticateJwt,async (req, res) => {
  // logic to view purchased courses
  console.log(req.user.username);
  const user = await User.findOne({username:req.user.username}).populate('puchasedCourses');
  if(user){
    res.json({purchasedCourse: user.puchasedCourses || []});
  }
  else{
    res.json({err:"user not found."});
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
