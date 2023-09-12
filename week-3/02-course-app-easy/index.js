const express = require("express");
const mongoose = require("mongoose");
const { adminLogin, adminSignup } = require("./controllers/admin.controller");
const { createCourse, getCourses, editCourse } = require("./controllers/course.controller");
const isAdmin = require("./middlewares/isAdmin");
const { userSignup, userLogin, purchaseCourse, getPurchasedCourses } = require("./controllers/user.controller");
const isUser = require("./middlewares/isUser");

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

mongoose
  .connect("mongodb://127.0.0.1:27017/course-app-easy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Admin routes
app.post("/admin/signup", adminSignup);

app.post("/admin/login", adminLogin);

app.post("/admin/courses", isAdmin, createCourse);

app.put("/admin/courses/:courseId", isAdmin, editCourse);

app.get("/admin/courses", isAdmin, getCourses);

// User routes
app.post("/users/signup", userSignup);

app.post("/users/login", userLogin);

app.get("/users/courses", isUser, getCourses);

app.post("/users/courses/:courseId", isUser, purchaseCourse);

app.get("/users/purchasedCourses", isUser, getPurchasedCourses);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
