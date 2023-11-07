const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const fs = require("fs");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  ADMINS = JSON.parse(fs.readFileSync("admins.json", "utf8"));
} catch {
  ADMINS = [];
}

try {
  USERS = JSON.parse(fs.readFileSync("users.json", "utf8"));
} catch {
  USERS = [];
}

try {
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf8"));
} catch {
  COURSES = [];
}

const adminSecretKey = "&6ujyMT$!Y#G9ZM";
const userSecretKey = "4242ujyM7$%^2w!Y6j/p0";

const generateAdminJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, adminSecretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) {
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
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (!existingAdmin) {
    ADMINS.push(admin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    res.json({ message: "Admin created successfully" });
  } else {
    res.status(403).json({ message: "Admin already exists" });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    const token = generateAdminJwt(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.courseId = Date.now();
  COURSES.push(course);
  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.json({
    message: "Course created successfully",
    courseId: course.courseId,
  });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  var course = COURSES.find((allCourse) => allCourse.courseId === courseId);
  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCourses: [] };
  const existingUser = USERS.find((a) => a.username === user.username);
  if (!existingUser) {
    USERS.push(user);
    fs.writeFileSync("users.json", JSON.stringify(USERS));
    res.json({ message: "User created successfully" });
  } else {
    res.status(403).json({ message: "User already exists" });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (user) {
    const token = generateUserJwt(user);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", authenticateUserJwt, (req, res) => {
  // logic to list all courses
  var publishedCourses = COURSES.filter((course) => course.published);
  res.json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", authenticateUserJwt, (req, res) => {
  // logic to purchase a course
  const headerCourseId = parseInt(req.params.courseId);
  const usr = USERS.find((a) => a.username === req.user.username);
  var chk = usr.purchasedCourses.includes(headerCourseId);
  if (chk) {
    res.status(401).json({ message: "Course already purchased" });
  } else {
    var course = COURSES.find((crs) => crs.courseId === headerCourseId);
    if (course) {
      if (course.published) {
        usr.purchasedCourses.push(headerCourseId);
        fs.writeFileSync("users.json", JSON.stringify(USERS));
        res.json({ message: "Course purchased successfully" });
      } else {
        res.status(401).json({ message: "Course is not yet published" });
      }
    } else {
      res.status(404).json({ message: "Course not found or not available" });
    }
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  const usr = USERS.find((a) => a.username === req.user.username);
  var purchases = COURSES.filter((c) =>
    usr.purchasedCourses.includes(c.courseId)
  );
  res.json({ purchasedCourses: purchases });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
