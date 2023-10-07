const express = require("express");
const { Router } = require("express");
const { Admin, Course } = require("../db/index");
const { authenticateJwt, generateJwt } = require("../middlewares/auth");

const router = Router();

router.use(express.json());

// Admin routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  console.log("admin : ", admin);
  if (admin) {
    res.status(403).json({ message: "Admin Already Exists !" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save(); // .save() method saves the newly created admin in the mongoose database
    const jwtObj = { username, role: "ADMIN" };
    let token = generateJwt(jwtObj);
    res.json({ message: "admin created succesfully !", token });
  }
});

router.post("/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;
  console.log("req.body : ", req.body);
  const admin = await Admin.findOne({ username, password });
  console.log(
    "admin : ",
    admin
  );
  if (!admin) {
    res.status(403).json({ message: "Invalid Username/Password" });
  } else {
    const jwtObj = { username, role: "ADMIN" };
    const token = generateJwt(jwtObj);
    res.json({ message: "Logged In Succesfully !", token });
  }
});

router.post("/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  console.log("body : ", req.body);
  const course = new Course(req.body);
  await course.save();
  res.json({
    message: "Course Created Succesfully !",
    courseId: course.id,
    course: req.body,
  });
});

router.put("/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  const courseFound = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    { new: true }
  );
  if (courseFound) {
    res.json({ message: "Course Updated Succesfully !" });
  } else {
    res.status(404).json({ message: "Course Not Found !" });
  }
});

router.get("/courses", async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

module.exports = router;
