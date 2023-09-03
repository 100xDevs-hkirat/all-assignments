const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let COURSE_PURCHASES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  var newAdmin = req.body;
  if (adminExists(newAdmin)) {
    return res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(newAdmin);
    res.status(200).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const admin = req.headers;
  if (adminAuthentication(admin)) {
    return res.status(200).json({ message: "Logged in successfully" });
  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  if (adminAuthentication(req.headers)) {
    let newCourse = req.body;
    newCourse.id = generateUniqueID();
    COURSES.push(newCourse);
    return res.status(200).json({
      message: "Course created successfully",
      courseId: newCourse.id,
    });
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  if (adminAuthentication(req.headers)) {
    let index = COURSES.findIndex(
      (c) => c.id === parseInt(req.params.courseId)
    );
    if (index === -1) {
      return res.status(404).json({ message: "Course not found" });
    } else {
      COURSES[index] = req.body;
      return res.status(200).json({ message: "Course updated successfully" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  if (adminAuthentication(req.headers)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(COURSES);
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let newUser = req.body;
  if (userExists(newUser)) {
    return res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(newUser);
    return res.status(200).json({ message: "User created successfully" });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const user = req.headers;
  if (userAuthentication(user)) {
    return res.status(200).json({ message: "Logged in successfully" });
  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  if (userAuthentication(req.headers)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(COURSES);
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  if (userAuthentication(req.headers) && courseExists(req.params.courseId)) {
    let index = COURSES.findIndex((c) => c.id === req.params.courseId);
    let purchaseDetail = {
      username: req.headers.username,
      courseDeets: COURSES[index],
    };
    COURSE_PURCHASES.push(purchaseDetail);
    return res.status(200).json({ message: "Course purchased successfully" });
  } else {
    return res
      .status(403)
      .json({ message: "Unauthorized or Course not found" });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  let searchResult = [];
  if (userAuthentication(req.headers)) {
    for (let i = 0; i < COURSE_PURCHASES.length; i++) {
      if (COURSE_PURCHASES[i].username === req.headers.username) {
        searchResult.push(COURSE_PURCHASES[i].courseDeets);
      }
    }
    return res.json(searchResult);
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// Returns true if admin exists
function adminExists(admin) {
  for (var i = 0; i < ADMINS.length; i++) {
    if (
      ADMINS[i].username === admin.username &&
      ADMINS[i].password === admin.password
    ) {
      return true;
    }
  }
  return false;
}

// Returns true if user exists
function userExists(user) {
  for (var i = 0; i < USERS.length; i++) {
    if (
      USERS[i].username === user.username &&
      USERS[i].password === user.password
    ) {
      return true;
    }
  }
  return false;
}

// Returns true if admin authentication is successful
function adminAuthentication(details) {
  for (var i = 0; i < ADMINS.length; i++) {
    if (
      ADMINS[i].username === details.username &&
      ADMINS[i].password === details.password
    ) {
      return true;
    }
  }
  return false;
}

// Returns true if user authentication is successful
function userAuthentication(details) {
  for (var i = 0; i < USERS.length; i++) {
    if (
      USERS[i].username === details.username &&
      USERS[i].password === details.password
    ) {
      return true;
    }
  }
  return false;
}

// Generates a unique ID
function generateUniqueID() {
  return Math.floor(Math.random() * 900000) + 100000;
}

// Returns true if a course with the given ID exists
function courseExists(ID) {
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === ID) {
      return true;
    }
  }
  return false;
}
