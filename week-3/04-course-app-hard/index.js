// const express = require('express');
import express from "express";
import body_parser from "body-parser";
import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();
app.use(cors());
app.use(body_parser.json());

const JWT_SECRET_TOKEN = "M@n@oDemO";
// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

function generateToken(data) {
  return jwt.sign(data, JWT_SECRET_TOKEN,);
}

function verifyToken(data) {
  return jwt.verify(data, JWT_SECRET_TOKEN);
}

///First define the schema
const adminSchema = new mongoose.Schema({
  // id: String,
  adminName: String,
  adminPassword: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  amount: Number,
});

const userSchema = new mongoose.Schema({
  // id: String,
  userName: String,
  userPassword: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
})

const courseSchema = new mongoose.Schema({
  // id: String,
  courseName: String,
  courseDetails: String,
  authorId: String,
  amount: Number
});

///Second define models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

async function connectMongoDb() {
  console.log("mongodb://localhost:27017/courses");
  ///Third Connection with DB
  await mongoose.connect("mongodb://127.0.0.1:27017/courses", {
    //  useNewUrlParser: true,
    // useUnifiedTopology: true
  });
}
connectMongoDb();
// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin\

  const { adminName, adminPassword } = req.body;
  if ((adminName && adminName.length <= 0) || (adminPassword && adminPassword.length <= 0)) {
    res.status(400).send({ statusCode: 0, message: "One or more fields are Empty" });
    return;
  }

  var isAlreadyAdmin = await Admin.find({ adminName, adminPassword });
  console.log(isAlreadyAdmin);
  if (isAlreadyAdmin.length > 0) {
    res.status(403).send({ statusCode: 0, message: "User Already Present" });
    return;
  } else {
    const newAdmin = new Admin({
      id: uuid4(),
      adminName: adminName,
      adminPassword: adminPassword,
      courses: [],
      amount: 0
    });
    newAdmin.save();
    res.send({ statusCode: 1, id: newAdmin.id, token: generateToken({ adminName: adminName, adminPassword: adminPassword }) });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const { adminName, adminPassword } = req.body;
  const isUserLogin = await Admin.find({ adminName, adminPassword });
  if (isUserLogin.length > 0) {
    res.send({ statusCode: 1, data: isUserLogin[0], token: generateToken({ adminName: adminName, adminPassword: adminPassword }) });
  } else {
    res.status(403).send({ statusCode: 0, message: "User Details Invalid" })

  }

});

const adminMidddleware = async (req, res, next) => {
  const token = req.headers.token;
  const { adminName, adminPassword } = verifyToken(token);

  const isUserValid = await Admin.find({ adminName, adminPassword });
  if (isUserValid.length > 0) {
    req.user = isUserValid[0];
    next();
  } else {
    res.status(403).send({ statusCode: 0, message: "Unauthorized" });
  }
};
app.post('/admin/courses', adminMidddleware, async (req, res) => {
  // logic to create a course
  const { courseName, courseDetails, amount } = req.body;
  const newCourse = new Course({
    courseName: courseName,
    courseDetails: courseDetails,
    amount: amount,
    authorId: req.user._id
  });
  const courseId = await newCourse.save();
  req.user.courses.push(newCourse);
  await Admin.findByIdAndUpdate(req.user._id, req.user);
  res.send({ statusCode: 1, message: "Course Added" });
});

app.put('/admin/courses/:courseId', adminMidddleware, async (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const { courseName, courseDetails } = req.body;
  const updatedCourse = await Course.findByIdAndUpdate({ _id: courseId }, { courseName: courseName, courseDetails: courseDetails }, { new: true });
  res.send({ statusCode: 1, data: updatedCourse })

});

app.get('/admin/courses', adminMidddleware, async (req, res) => {
  let allCourse1 = [];
  // logic to get all courses
  // const allCourseId = req.user;
  // console.log(allCourseId.length);
  // const allCourse = await Promise.all(
  //   allCourseId.forEach(async (singleCourseId) => {

  let adminCourses = await Course.find({ authorId: req.user._id });
  //     console.log(singleCourseId);

  //     // if (ele) {

  //     allCourse1.push(allCourse);
  //     // }
  //     return allCourse1;
  //   }));



  res.send({ statusCode: 1, data: adminCourses });



});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { userName, userPassword } = req.body;
  if ((userName && userName.length <= 0) || (userPassword && userPassword.length <= 0)) {
    res.status(400).send({ statusCode: 0, message: "One or more fields are Empty" });
    return;
  }
  var isUserPresent = await User.findOne({ userName });
  if (isUserPresent) {
    res.send({ statusCode: 0, message: "User Data Already Present" });
  } else {
    let newUser = new User({
      userName: userName,
      userPassword: userPassword,
      courses: []
    });
    let userId = await newUser.save();

    res.send({
      statusCode: 1, message: "User Account Created Successfully", id: userId._id, token: generateToken({
        userName: userName,
        userPassword: userPassword
      })
    });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const { userName, userPassword } = req.body;
  if ((userName && userName.length <= 0) || (userName && userName.length <= 0)) {
    res.status(403).send({ statusCode: 0, message: "One or more fields are Empty" });
    return;
  }

  let isUserPresent = await User.findOne({ userName, userPassword });
  if (isUserPresent) {
    res.send({
      statusCode: 1, data: isUserPresent, token: generateToken({
        userName: userName,
        userPassword: userPassword
      })
    })
  } else {
    res.status(403).send({ statusCode: 0, message: "User Details Invalid" });
  }
});

const userMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  const { userName, userPassword } = verifyToken(token);
  let user = await User.findOne({ userName, userPassword });
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).send({ statusCode: 0, message: "Unauthorized" })
  }
};

app.get('/users/courses',  userMiddleware,async (req, res) => {
  // logic to list all courses
  let allCourses = await Course.find({});
  if (allCourses.length > 0) {
    res.send({ statusCode: 1, data: allCourses });
  } else {
    res.send({ statusCode: 0, message: "No Courses Found" });
  }

});

app.post('/users/courses/:courseId', userMiddleware, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;

  let course = await Course.findOne({ _id: courseId });


  if (course) {
    req.user.courses.push(course._id);
    let isUserALredyPresent = User.findById({ _id: req.user._id });
    if (isUserALredyPresent) {
      res.send({ statusCode: 0, message: "You have already bought the Course" })

      return;
    }
    await User.findByIdAndUpdate({ _id: req.user._id }, req.user);
    let adminData = await Admin.findOne({ _id: course.authorId });
    adminData.amount = (adminData.amount + course.amount);
    // await Admin.findByIdAndUpdate({ _id: course.authorId }, { $set: { amount: (amount + course.amount) } });
    await Admin.findByIdAndUpdate({ _id: course.authorId }, adminData);

    res.send({ statusCode: 1, message: "Course Added Successfully" });
  } else {
    res.send({ statusCode: 0, message: "Course Not Found" })
  }
});

app.get('/users/purchasedCourses', userMiddleware, async (req, res) => {
  // logic to view purchased courses
  let allPurchasedCourseId = req.user.courses;
  if (allPurchasedCourseId.length > 0) {
    let allPurchasedCourse = [];
    for (let i = 0; i < allPurchasedCourseId.length; i++) {
      let singleCourses = await Course.findById(allPurchasedCourseId[i]);
      allPurchasedCourse.push(singleCourses);
    }
    res.send({ statusCode: 1, data: allPurchasedCourse });
  } else {
    res.send({ statusCode: 0, message: "Buy Courses to see here" })
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
