const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserModel, AdminModel, CourseModel } = require("./models");

app.use(express.json());

const SECRET = "arunchaitanya";

let ADMINS = [];
let USERS = [];
let COURSES = [];

const authenticationMiddleware = async (req, res, next) => {
  if (!req.headers.authentication) return res.status(401).send("Unauthorized");
  const token = req.headers.authentication.split(" ")[1];
  const user = await jwt.verify(token, SECRET);
  
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://arun:arun@cluster0.djzdzkm.mongodb.net/courses-api?retryWrites=true&w=majority"
    );
    console.log("CONNECTED TO DATABASE");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  } catch (e) {
    console.log(`Error in connecting server: ${e}`);
  }
};

start();
