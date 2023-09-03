const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const secretKey = "myName008";

const createToken = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey);
};

const autenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      return (req.user = user);
      next();
    }
  });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((u) => u.username === admin.username);
  if (existingAdmin) {
    res.json({ massage: "user already registerd" });
  }
  ADMINS.push(admin);
  const token = createToken(admin);
  res.json({ massage: "succesfully signup" }, token);
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const adminFound = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (adminFound) {
    const token = createToken(adminFound);
    res.json({ massage: "admin logged in sucsessful" }, token);
  }
  res.json({ massage: "admin authenticate failed" });
});

app.post("/admin/courses", autenticateToken, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ massage: "course added sucsessfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", autenticateToken, (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const updatedCourse = req.body;
  const course = COURSES.find((c) => c.courseId === courseId);
  if (course) {
    Object.assign(course, updatedCourse);
    res.json({ massage: "course edited Sucsessfull" });
  }
});

app.get("/admin/courses", autenticateToken, (req, res) => {
  // logic to get all courses
  res.json({ massage: "all course", COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const exsistingUser = USERS.find((a) => a.username === user.username);
  if (exsistingUser) {
    res.json({ massage: "user already signed up" });
  }
  const token = createToken(user);
  USERS.push(user);
  res.json({ massage: "signup sucsessfull", token });
});

app.post("/users/login", autenticateToken, (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const userFound = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (userFound) {
    const token = createToken(userFound);
    res.json({ massage: "user logged in", token });
  }
});

app.get("/users/courses", autenticateToken, (req, res) => {
  // logic to list all courses
  res.json({ allCourse: COURSES });
});

app.post("/users/courses/:courseId", autenticateToken, (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCorse) {
        user.purchasedCorse = [];
      }
      user.purchasedCorse.push(course);
      res.json({ massage: "course purchased" });
    } else {
      res.json({ massage: "user not found" });
    }
  } else {
    res.json({ massage: "course not found" });
  }
});

app.get("/users/purchasedCourses",autenticateToken, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(u=>u.username === req.user.username)
  if(user && user.purchasedCorse){
    res.json({purchasedCorse:user.purchasedCorse})
  }
  res.json({massage:'no course purchesed'})
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
