const express = require("express");
const app = express();
const { Admin, Course, User } = require("./models/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const config = require("config");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoose = require("mongoose");

//Requiring models for mongoDB
const { ADMINS, COURSES, USERS } = require("./models");

app.use(cors());
app.use(express.json());

//Connect to the database
connectDB();

// Admin routes
app.post("/admin/signup", async (req, res) => {
  try {
    let { username, password } = req.body;

    //Check if username/email already taken
    let admin = await ADMINS.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: "Username / Email already taken" });
    }
    // Encrypting password using bcrypt
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    admin = new ADMINS({
      username,
      password,
    });

    await admin.save();

    const payload = { user: admin.id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.headers;

    //Check if user is registered
    const admin = await ADMINS.findOne({ username });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    const isMatch = bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: admin.id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/admin/courses", auth, async (req, res) => {
  try {
    const { title, description, price, imgLink, published } = req.body;

    const course = new COURSES({
      title,
      description,
      price,
      imgLink,
      published,
      userID: req.user,
    });
    await course.save();

    res.status(200).json({ msg: "Published a new course" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.put("/admin/courses/:courseId", auth, async (req, res) => {

  try {
    //Fetching the course to update only if it belongs the logged in admin 
    const course = await COURSES.findByIdAndUpdate(req.params.courseId,{
      ...req.body
    });
    res.status(200).json({ msg: "Updated the course" });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/courses", auth, async (req, res) => {
  try {
    const adminCourses = await COURSES.find({userID : req.user});

    res.status(200).json(adminCourses);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// -------------------------------------------------------------------------------------
// User routes

app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;

  //Check if username/email already taken
  const checkTaken = USERS.find((user) => user.username === username);
  if (checkTaken) {
    return res.json({ msg: "Username / Email already taken" });
  }
  const newUser = new User(username, password);
  USERS.push(newUser.getDetails());
  const payload = { user: newUser.getDetails().id };
  jwt.sign(
    payload,
    config.get("jwtSecret"),
    { expiresIn: "1d" },
    (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    }
  );
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;

  //Check if user is registered
  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
  if (user.password === password) {
    const payload = { user: user.id };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  }
});

app.get("/users/courses", auth, (req, res) => {
  res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId", auth, (req, res) => {
  const course = COURSES.find(
    (course) => course.id === String(req.params.courseId)
  );
  const userInd = USERS.findIndex((user) => user.id === req.user);
  USERS[userInd].courses.push(course);
  res.send({ msg: "Bought the course" });
});

app.get("/users/purchasedCourses", auth, (req, res) => {
  const user = USERS.find((user) => user.id === req.user);
  const courses = user.courses;
  res.status(200).json(courses);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
