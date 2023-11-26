const express = require("express");
//const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
//const fs = require("fs");
app.use(express.json());
const jwt = require("jsonwebtoken");
const e = require("express");

let ADMINS = [];
let USERS = [];
let COURSES = [];

//defining mongodb schemas
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
  imagelink: String,
  published: Boolean,
});

//defining mongodb models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const secretKey = "r!ddlEm3";

const generateToken = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
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

mongoose.connect(
  "mongodb+srv://jagdishrajputca:TEDVEEW65o39QlQx@cluster0.8smof0p.mongodb.net/Courses",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Courses" }
);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up adminit
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin) {
    return res.status(409).send("Admin already exists");
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = generateToken(newAdmin);
    //writeData("ADMINS.txt", ADMINS);
    return res
      .status(200)
      .json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  let { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });

  if (admin) {
    token = generateToken(admin);
    //console.log(token);
    return res
      .status(200)
      .json({ message: "User looged in successfully", token });
  } else return res.status(403).json({ message: "Authentication failed" });
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  let course = new Course(req.body);
  await course.save();
  res.status(200).json({
    message: "Course created successfully",
    courseId: course.id,
  });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  //Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink:
  //'https://updatedlinktoimage.com', published: false }
  //Output: { message: 'Course updated successfully' }
  // logic to edit a course

  let course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });

  if (!course) {
    return res.status(404).send("Course not found");
  } else {
    return res.status(200).json({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  return res.status(200).json(await Course.find({}));
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user

  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    return res.status(409).send("User already exists");
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    let token = generateToken(newUser);
    //writeData("USERS.txt", USERS);
    return res
      .status(200)
      .json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;

  const user = await User.findOne({ username, password });

  if (user) {
    let token = generateToken(user);
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } else {
    res.status(403).json({ message: "User Authenticatoin failed" });
  }
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  return res.status(200).json(await Course.find({ published: true }));
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course
  //let course = req.body;
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      return res.status(200).json({ message: "Course purchased successfully" });
    } else {
      return res.status(403).json({ message: "User Authenticatoin failed" });
    }
  } else {
    return res.status(403).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    return res
      .status(200)
      .json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    return res.status(403).json({ message: "User Authenticatoin failed" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port: 3000");
});
