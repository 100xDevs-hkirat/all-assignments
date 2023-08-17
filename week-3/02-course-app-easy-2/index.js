const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// const secretKey = "user";
const adminSecretKey = "admin";
const userSecretKey = "user";

const generateJwt = (user, secretKey) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1hr" });
};

const authenticateJwt = (secretKey) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const adminExist = ADMINS.find((a) => a.username === admin.username);
  if (adminExist) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    const token = generateJwt(admin, adminSecretKey);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  const admin = req.headers;
  const adminExist = ADMINS.find(
    (a) => a.username === admin.username && a.password === admin.password
  );
  if (adminExist) {
    const token = generateJwt(admin, adminSecretKey);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
});

app.post("/admin/courses", authenticateJwt(adminSecretKey), (req, res) => {
  const course = req.body;
  if (course.title) {
    //atleast pass title to create a course
    const id = Date.now();
    course.id = id;
    COURSES.push(course);
    res.json({ message: "Course created successfully", courseId: course.id });
  } else {
    res.status(406).json({ message: "Pass title to create course" });
  }
});

app.put(
  "/admin/courses/:courseId",
  authenticateJwt(adminSecretKey),
  (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const updatedCourse = req.body;
    const courseIndex = COURSES.findIndex((c) => c.id === courseId);
    if (courseIndex > -1) {
      COURSES[courseIndex] = { ...COURSES[courseIndex], ...updatedCourse };
      res.json({ message: "Course updated successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
);

app.get("/admin/courses", authenticateJwt(adminSecretKey), (req, res) => {
  res.json({
    courses: COURSES,
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  const user = req.body;
  const userExist = USERS.find((u) => u.username === user.username);
  if (userExist) {
    res.status(403).json({ message: "User already exist" });
  } else {
    USERS.push(user);
    const token = generateJwt(user, userSecretKey);
    res.json({ message: "user created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  const user = req.headers;
  const userExist = USERS.find(
    (u) => u.username === user.username && u.password === user.password
  );
  if (userExist) {
    const token = generateJwt(user, userSecretKey);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
});

app.get("/users/courses", authenticateJwt(userSecretKey), (req, res) => {
  res.json({ courses: COURSES });
});

app.post(
  "/users/courses/:courseId",
  authenticateJwt(userSecretKey),
  (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const userFound = USERS.find((u) => u.username === req.user.username); //able to access user.username from req obj bcz it was savd in it while decrypting jwt
    const coursExist = COURSES.find((c) => c.id === courseId && c.published);
    if (coursExist) {
      if (!userFound.purchasedCourses) {
        userFound.purchasedCourses = [];
      }
      userFound.purchasedCourses.push(coursExist.id);
      res.json({ message: "Course purchased successfully" });
    } else {
      res.json({ message: "Course not found" });
    }
  }
);

app.get(
  "/users/purchasedCourses",
  authenticateJwt(userSecretKey),
  (req, res) => {
    const userFound = USERS.find((u) => u.username === req.user.username);
    if (userFound.purchasedCourses) {
      res.json({ purchasedCourses: userFound.purchasedCourses });
    } else {
      res.status(404).json({ message: "No courses purchased" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
