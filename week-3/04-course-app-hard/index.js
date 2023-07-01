const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Admin = require("./admin");
const User = require("./users");
const Course = require("./course");
const connect = require("./db-config");

const SECRET = "Hard";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

function generatejwt(payload) {
  console.log(payload);
  let token = jwt.sign(
    { username: payload.username, id: payload._id, role: payload.role },
    SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
}

async function authenticateJwt(req, res, next) {
  let authheader = req.headers.authorization;
  if (authheader) {
    let token = authheader.split(" ")[1];

    jwt.verify(token, SECRET, async (err, data) => {
      if (err) {
        res.status(403).json({
          message: "Invaild token or expried",
        });
      }

      if (data.role == "Admin") {
        var response = await Admin.findById(data.id);
      } else {
        var response = await User.findById(data.id);
      }
      console.log(response);
      let payload = {
        id: response.id,
        username: response.username,
        role: response.role,
      };

      req.user = payload;

      next();
    });
  }
}

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  try {
    let response = await Admin.create(req.body);
    let token = generatejwt(response);
    return res.status(201).json({
      message: "Admin created successfully",
      success: true,
      err: {},
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Soemthing went wrong",
      success: false,
      err: error,
    });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  try {
    let filter = {
      username: req.headers.username,
      password: req.headers.password,
    };
    let response = await Admin.findOne(filter);
    let token = generatejwt(response);
    return res.status(201).json({
      message: "Logged in successfully",
      success: true,
      err: {},
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Soemthing went wrong",
      success: false,
      err: error,
    });
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  try {
    let response = await Course.create(req.body);
    return res.status(201).json({
      message: "Course created successfully",
      success: true,
      courseId: response.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Soemthing went wrong",
      success: false,
      err: error,
    });
  }
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  try {
    let courseId = req.params.courseId;
    let response = await Course.findByIdAndUpdate(courseId, req.body);
    return res.status(200).json({
      message: "Course updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  try {
    let response = await Course.find({});
    return res.status(200).json({
      courses: response,
      success: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  try {
    let response = await User.create(req.body);
    let token = generatejwt(response);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      err: {},
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Soemthing went wrong",
      success: false,
      err: error,
    });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  try {
    let filter = {
      username: req.headers.username,
      password: req.headers.password,
    };
    let response = await User.findOne(filter);
    let token = generatejwt(response);
    return res.status(201).json({
      message: "Logged in successfully",
      success: true,
      err: {},
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Soemthing went wrong",
      success: false,
      err: error,
    });
  }
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  try {
    let response = await Course.find({});
    return res.status(200).json({
      courses: response,
      success: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course
  try {
    console.log("inside purchase");
    let course = await Course.findById(req.params.courseId);
    console.log(course);
    console.log(req.body.id);
    let user = await User.findById(req.user.id);
    user.purchasedCourses.push(course);
    await user.save();
    return res.status(200).json({
      message: "course purchased successfully",
      success: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  try {
    let user = await User.findById(req.user.id);
    return res.status(200).json({
      purchasedCourses: user.purchasedCourses,
      success: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
  connect();
  console.log("db connected");
});
