const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Read data from file, or initialize to empty array if file does not exist
try {
  ADMINS = JSON.parse(fs.readFileSync("admins.json", "utf8"));
  USERS = JSON.parse(fs.readFileSync("users.json", "utf8"));
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}
console.log(ADMINS);
console.log(USERS);

const SECRET = "my-secret-key";

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log(token);
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        // console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;
  const admin = ADMINS.find((a) => a.username === username);
  // console.log("admin signup");
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = { username, password };
    // console.log(newAdmin);
    ADMINS.push(newAdmin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // console.log(req.body);
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // console.log(req.params.courseId);
  // console.log(req.params);
  const course = COURSES.find((c) => c.id === parseInt(req.params.courseId));
  if (course) {
    Object.assign(course, { ...req.body, id: parseInt(req.body.id) });
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    COURSES = JSON.parse(fs.readFileSync("courses.json", "utf8"));
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  const course = COURSES.find((c) => c.id === parseInt(req.params.courseId));
  if (course) {
    res.json({ course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // console.log(req.body, req.username);
  const { username, password, firstName, lastName } = req.body;
  const user = USERS.find((u) => u.username === username);
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = { username, password, firstName, lastName };
    USERS.push(newUser);
    fs.writeFileSync("users.json", JSON.stringify(USERS));
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  const courses = COURSES.filter((course) => course.published);
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  const course = COURSES.find(
    (c) => c.id === parseInt(req.params.courseId) && c.published
  );
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      if (user.purchasedCourses.some(pc => pc.id === course.id)) {
        res.status(403).json({ message: "Course already purchased" });
        return;
      }
      user.purchasedCourses.push(course);
      fs.writeFileSync("users.json", JSON.stringify(USERS));
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/courses/:courseId", authenticateJwt, (req, res) => {
  const course = COURSES.find(
    (c) => c.id === parseInt(req.params.courseId) && c.published
  );
  if (course) {
    res.json({ course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username);
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
