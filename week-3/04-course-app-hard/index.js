const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(cors());
// Mongoose schemas
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
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const DBpass = "AWPdD1qDh2de2SEh";
const database =
  "mongodb+srv://soumojit:AWPdD1qDh2de2SEh@course-selling-app.szdjbcd.mongodb.net/?retryWrites=true&w=majority";

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

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
