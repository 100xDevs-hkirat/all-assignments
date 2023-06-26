const express = require("express");
const uuid = require("uuid");
const app = express();

app.use(express.json());

let ADMINS = [{ username: "ng", password: "124" }];
let USERS = [];
let COURSES = [];
let isUserLoggedIn = false;

async function logInAdmin(req, res) {
  // logic to log in admin
  const username = req.headers.username;
  const password = req.headers.password;
  const index = await ADMINS.findIndex(
    (admin) => admin.username === username && admin.password === password
  );
  return index;
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username } = req.body;

  //check if admin with same creds alreday exists
  const index = ADMINS.findIndex((admin) => admin.username === username);
  if (index > -1) {
    res.status(400).send("Admin already Exists");
  }
  ADMINS.push(req.body);
  res.status(200).json({ message: "Admin created successfully" });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  logInAdmin(req, res).then((index) => {
    if (index <= -1) {
      res.status(400).send("No Admin with such creds exists");
    } else {
      isUserLoggedIn = true;
      res.status(201).json({ message: "Logged in successfully" });
    }
  });
});

app.post("/admin/courses", (req, res) => {
  //https://picsum.photos/200
  // logic to create a course
  logInAdmin(req, res).then((index) => {
    if (index <= -1) {
      res
        .status(400)
        .send("No Admin with such creds exists, cannot create a course");
    } else {
      isUserLoggedIn = true;
      const courseId = uuid.v4();
      COURSES.unshift({ ...req.body, courseId });
      res
        .status(200)
        .json({ message: "Course created successfully", courseId });
    }
  });
  console.log(JSON.stringify(COURSES));
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  logInAdmin(req, res).then((index) => {
    if (index <= -1) {
      res
        .status(400)
        .send("No Admin with such creds exists, Cannot Edit Course");
    } else {
      isUserLoggedIn = true;
      COURSES = COURSES.map((crs) =>
        crs.courseId === courseId ? { ...req.body, courseId } : crs
      );
      res.status(201).json({ message: "Course updated successfully" });
    }
  });
  console.log(JSON.stringify(COURSES));
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  logInAdmin(req, res).then((index) => {
    if (index <= -1) {
      res.status(400).send("No Admin with such creds exists");
    } else {
      isUserLoggedIn = true;
      res.status(201).json(COURSES);
    }
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
