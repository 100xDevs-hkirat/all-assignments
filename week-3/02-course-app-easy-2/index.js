const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const AdminSecret = "hfaihi23hahk";
const UserSecret = "hguehgiw223j";

// Token
const generateToken = (user, secret) => {
  const payload = { username: user.username };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return token;
};
// Auth middleware

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, AdminSecret, (err, data) => {
      if (err) {
        res.status(403).json({ message: "Could not authenticate" });
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.status(401);
  }
};
// USER AUTH
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, UserSecret, (err, data) => {
      if (err) {
        res.status(403).json({ message: "Could not authernticate" });
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.status(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find((admin) => admin.username === username);
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(req.body);
    const token = generateToken(req.body, AdminSecret);
    res.json({ message: "Admin created successfully", token: token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  if (admin) {
    const token = generateToken(admin, AdminSecret);
    res.json({ message: "Logged in successfully", token: token });
  } else {
    res.status(403).json({ message: "Could not find the user" });
  }
});

app.post("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to create a course
  const courseDetails = { ...req.body, id: COURSES.length + 1 };
  COURSES.push(courseDetails);
  res.json({
    message: "Course created successfully",
    courseId: courseDetails.id,
  });
});

app.put("/admin/courses/:courseId", authenticateAdmin, (req, res) => {
  // logic to edit a course
  const id = req.params.courseId * 1;
  const course = COURSES.find((course) => course.id === id);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated successfully" });
  } else {
    res.json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const exists = USERS.find((u) => u.username === user.username);

  if (exists) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    const token = generateToken(user, UserSecret);
    res.json({ message: "User created successfully", token: token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.body;
  const validUser = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (validUser) {
    const token = generateToken(req.body, UserSecret);
    res.json({ message: "Logged in successfully", token: token });
  } else {
    res.status(403).json({ message: "Could not find the user" });
  }
});

app.get("/users/courses", authenticateUser, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((course) => course.published === true) });
});

app.post("/users/courses/:courseId", authenticateUser, (req, res) => {
  // logic to purchase a course
  const id = req.params.courseId * 1;
  const user = USERS.find((usr) => usr.username === req.user.username);
  const course = COURSES.find((c) => c.id === id);
  if (course) {
    if (!user.purchasedCourses) {
      user.purchasedCourses = [];
    }
    user.purchasedCourses.push(course);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404);
  }
});

app.get("/users/purchasedCourses", authenticateUser, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((usr) => usr.username === req.user.username);
  if (user) {
    res.json({
      purchasedCourses: user.purchasedCourses || "No courses purchased",
    });
  } else {
    res.status(404);
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
