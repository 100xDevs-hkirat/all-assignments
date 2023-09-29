const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User, Course } = require("../db/index");
const { authenticateJwt, generateJwt } = require("../middlewares/auth");
const router = express.Router();

router.use(express.json());

// User routes
router.post("/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    generateJwt({ username, role: "USER" });
    const token = generateJwt({ username, role: "USER" });
    res.json({ message: "User Registered Succesfully", token });
  }
});

router.post("/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) {
    res.status(403).json({ message: "Invalid Username or Password" });
  } else {
    const token = generateJwt({ username, role: "USER" });
    console.log(token);
    // req.user = username;
    res.json({ message: "User Logged In Succesfully !", token });
  }
});

router.get("/me", authenticateJwt, (req, res) => {
  console.log("req.user : ", req.user);
  res.json(req.user);
});

router.get("/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses\
  const courses = await Course.find({});
  res.json({ courses });
});

router.post("/courses/:courseId", authenticateJwt, async (req, res) => {
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

router.get("/course/:courseID", authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseID);
  res.json({ course });
});

router.post("/purchaseCourse", authenticateJwt, async (req, res) => {
  // logic to purchase course
  const course = req.body;
  const user = await User.findOne({ username: req.user.username });
  const courseFound = await Course.findById(course.id);

  if (courseFound && user) {
    // verifying if there are any duplicates of this course !
    // let duplicate = user.purchasedCourses.some((c)=> c.)
    let duplicate = user.purchasedCourses.some((c) => c == course.id);
    console.log("duplication : ", duplicate);
    if (!duplicate) {
      user.purchasedCourses.push(course.id);
      await user.save();
      res.json({
        message: "Course purchased successfully",
        p: user.purchasedCourses,
      });
    } else {
      res.json({ message: "You have already purchased this course !" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

router.get("/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username });

  if (user) {
    // Get full course details for each purchased course
    const purchasedCourses = await Course.find({
      _id: { $in: user.purchasedCourses },
    });

    res.json({ purchasedCourses });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

module.exports = router;
