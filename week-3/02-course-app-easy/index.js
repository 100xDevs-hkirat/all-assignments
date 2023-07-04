const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes

function adminAuthentication(req, res, next) {
  const { username, password } = req.headers;
  if (username && password) {
    if (
      ADMINS.find((a) => a.username === username && a.password === password)
    ) {
      next();
    } else {
      res.status(403).json({ message: "Admin authentication failed" });
    }
  }
}

function userAuthentication(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    if (USERS.find((u) => u.username === username && u.password === password)) {
      next();
    } else {
      res.status(403).json({ message: "User authentication failed" });
    }
  }
}
// logic to sign up admin
app.post("/admin/signup", (req, res) => {
  const admin = req.body;

  if (admin.username && admin.password) {
    const existingUser = ADMINS.find((a) => a.username === admin.username);
    if (existingUser) {
      res.status(403).send("user already exists");
    }
    const newAdmin = {
      username,
      password,
      admin: true,
    };
    ADMINS.push(newAdmin);
    res.status(201).send("Admin created sucessfully");
  } else {
    res.status(404).send("error");
  }
});

// logic to log in admin
app.post("/admin/login", adminAuthentication, (req, res) => {
  res.status(200).json({ message: "Admin login success" });
});

// logic to create a course
app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;

  course.id = Date.now();
  COURSES.push(course);
  res
    .status(201)
    .json({ message: "course created successfully", courseId: course.id });
});

// logic to edit a course
app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  if (courseId) {
    const course = COURSES.find((course) => course.id === courseId);
    Object.assign(course, req.body);
    res.status(201).json({ message: "course updated successfully" });
  } else {
    res.status(400).json({ message: "course not found" });
  }
});

// logic to get all courses
app.get("/admin/courses", adminAuthentication, (req, res) => {
  const filterdCourses = [];
  COURSES.map((c) => {
    if (c.published) {
      filterdCourses.push(c);
    }
  });
  if (filterdCourses.length > 0) {
    res.status(200).json(filterdCourses);
  } else {
    res.status(401).send({ message: "no publised courses found" });
  }
});

// User routes

// logic to sign up user
app.post("/users/signup", userAuthentication, (req, res) => {
  const user = req.body;

  if (user.username && user.password) {
    const newUser = {
      username: user.username,
      password: user.password,
      purchased: [],
    };
    USERS.push(newUser);
    res.status(201).send("User created sucessfully");
  } else {
    res.status(400).send("please enter username and passoword");
  }
});

// logic to log in user
app.post("/users/login", userAuthentication, (req, res) => {
  res.status(201).json({ message: "Logged in successfully" });
});

// logic to list all courses
app.get("/users/courses", userAuthentication, (req, res) => {
  const courses = COURSES.filter((course) => course.published);
  if (courses.length) {
    res.status(200).json(courses);
  } else {
    res.status(403).json({ message: "no courses found" });
  }
});

// logic to purchase a course
app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const course = COURSES.find(
    (course) => course.id === courseId && course.published
  );

  if (course) {
    req.user.purchased.push(courseId);
    res.status(200).json({ message: "course purchased successfully" });
  } else {
    res.status(403).json({ message: "no course found" });
  }
});

// logic to view purchased courses
app.get("/users/purchasedCourses",userAuthentication, (req, res) => {

  const CoursesIds = req.user.purchasedCourses;
  const purchasedCourses =[]

  for(let i =0; i< COURSES.length; i++){
    if(CoursesIds.indexOf(COURSES[i].id !== -1)){
      purchasedCourses.push(COURSES[i]);
    }
  }
     res.json({purchasedCourses})
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
