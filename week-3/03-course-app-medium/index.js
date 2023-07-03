const express = require("express");
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Admin } = require("mongodb");
const { parseArgs } = require("util");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "adm1nS3c38";

try {
  ADMINS = JSON.parse(fs.readFileSync("admin.json", "utf-8"));
  USERS = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf-8"));
} catch (error) {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

function authenticateJwt(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const auth = token.split(" ")[1];
    jwt.verify(auth, secretKey, (err, user) => {
      if (err) {
        res.status(401).json({ message: "authentication failed" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
}

// Admin routes

// logic to sign up admin
app.post("/admin/signup", (req, res) => {
  const admin = req.headers;
  if (admin) {
    const isExistingUser = ADMINS.find(
      (a) => a.username === admin.username && a.password === admin.password
    );

    if (isExistingUser) {
      res.status(403).send({ message: "user already exist" });
    }
    ADMINS.push(admin);
    fs.writeFileSync("admin.json", JSON.stringify(ADMINS));
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Admin created successfullly", token });
  } else {
    res.status(403).json({ message: "please enter username and password" });
  }
});

// logic to log in admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;

  if (username && password) {
    const admin = ADMINS.find(
      (a) => a.username === username && a.password === password
    );
    if (admin) {
      const token = jwt.sign({ username, role: admin }, secretKey, {
        expiresIn: "1h",
      });
      res.status(201).json({ message: "authentication successfull", token });
    }
  } else {
    res.status(403).json({ message: "authentication failed" });
  }
});

// logic to create a course
app.post("/admin/courses", authenticateJwt, (req, res) => {
  const course = req.body;
  if (course) {
    course.id = Date.now();
    COURSES.push(course);
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res
      .status(201)
      .json({ message: "course creared successfully", courseId: course.id });
  } else {
    res.status(403).json({ message: "please enter course details" });
  }
});

// logic to edit a course
app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    const index = COURSES.findIndex((c) => c.id === courseId);
    Object.assign(course, req.body);
    COURSES[index] = course;
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.json(201).json({ message: "course updated successfully" });
  } else {
    res.status(404).json({ message: "Mo course found" });
  }
});

// logic to get all courses
app.get("/admin/courses", authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes

// logic to sign up user
app.post("/users/signup", (req, res) => {
  const user = req.body;
  if (user) {
    const newUser = {
      id: Date.now(),
      username: user.username,
      password: user.password,
      purchaedCourses: [],
    };
    USERS.push(newUser);
    fs.writeFileSync("user.json", JSON.stringify(USERS));
    const token = jwt.sign(
      { username: user.username, role: "user" },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created succesfully", token });
  } else {
    res.status(403).json({ message: "please enter course details" });
  }
});

// logic to log in user
app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;

  if (username && password) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const token = jwt.sign(
        { username: user.username, role: "user" },
        secretKey,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "user logged in successfully" }, token);
    } else {
      res.status(403).json({ message: "user name or password incorrect" });
    }
  } else {
    res.status(403).json({ message: "please enter username and password" });
  }
});

// logic to list all courses
app.get("/users/courses", authenticateJwt, (req, res) => {
  res.status(200).json({ courses: COURSES });
});

// logic to purchase a course
app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  // req.user.purchaedCourses.push(courseId);
  const course = COURSES.find((c) => c.id === courseId);

  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (!user.purchaedCourses) {
      user.purchaedCourses = [];
    } else {
      user.purchaedCourses.push(courseId);
      fs.writeFileSync("user.json", JSON.stringify(USERS));
      res.status(200).json('successfully purchased course')
    }
  } else {
    res.status(404).json({ message: "no course found" });
  }
});


// logic to view purchased courses
app.get("/users/purchasedCourses", authenticateJwt,(req, res) => {
  const user = USERS.find(u=> u.username === req.user.username);
  if(user){
    res.status(200).json({purchaedCourses: user.purchaedCourses || []})
  }else{
    res.status(403).json({message: 'no user found'})
  }

});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
