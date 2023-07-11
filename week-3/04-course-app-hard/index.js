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
    const course = await COURSES.findOneAndUpdate(
      { _id: req.params.courseId, userID: req.user },
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({ msg: "Updated the course" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/courses/:courseId", auth, async (req, res) => {
  try {
    //Fetching the course if it belongs the logged in admin
    const course = await COURSES.find({
      _id: req.params.courseId,
      userID: req.user,
    });
    if (course.length == 0) res.status(404).json({ msg: "Course Not Found" });
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/admin/courses", auth, async (req, res) => {
  try {
    const adminCourses = await COURSES.find({ userID: req.user });

    res.status(200).json(adminCourses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// -------------------------------------------------------------------------------------
// User routes

app.post("/users/signup", async (req, res) => {
  try {
    let { username, password } = req.body;

    //Check if username/email already taken
    let admin = await USERS.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: "Username / Email already taken" });
    }
    // Encrypting password using bcrypt
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    admin = new USERS({
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

app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.headers;

    //Check if user is registered
    const user = await USERS.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/users/courses", auth, async (req, res) => {
  const courses = await COURSES.find({published: true});
  res.status(200).json(courses);
});

app.post("/users/courses/:courseId", auth, async (req, res) => {
  try {
    const course = await COURSES.findById(req.params.courseId);
    if(course){
      const user = await USERS.findById(req.user, "-password");
      
      const alreadyBought = user.courses.find(item => item == String(req.params.courseId));
      
      if(alreadyBought) return res.status(400).json({msg : "Course already purchased"});

      user.courses.push(course);
      await user.save();
      res.status(200).json({ msg: "Purchased the course" });
    }else{
      res.status(404).json({msg : "Course not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/users/purchasedCourses", auth, async (req, res) => {
  try {
    const user = await USERS.findById(req.user);
    const courses = user.courses;
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
