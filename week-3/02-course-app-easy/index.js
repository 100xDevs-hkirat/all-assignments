const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//admin athentication
const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = find(
    (admin) => admin.username === username && admin.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).send("admin atuenticatin failed");
  }
};

//user authentication
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = find((u) => u.username === username && u.password === password);
  if (user) {
    req.user=user;
    next();
  } else {
    res.status(403).send("user autentication failed");
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const password = req.body.password;
  const foundAdmin = ADMINS.find((admin) => admin.username == username);
  if (foundAdmin) {
    res.send("admin already register");
  } else {
    ADMINS.push(username, password);
    res.status(200).send("admin registered sucsessfully");
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ massage: "admin logged in" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  const ID = Date.now();
  COURSES.push(course);
  res.json({ massage: "course created sucsessfully", ID });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const updatedCourse = req.body;
  const ID = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === ID);
  if (course) {
    Object.assign(course, updatedCourse);
    res.json({ massage: "course updated sucsessfully" });
  } else {
    res.json({ massage: "course not found" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ course: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: [],
  };
  const foundUser = USERS.find((u) => u.username === username);
  if (foundUser) {
    res.json({ msg: "user already registerd" });
  } else {
    USERS.push(user);
    res.send("user register sucsessfully");
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.send("user logged in");
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  let all_course = COURSES.filter((c) => c.published);
  res.json({ "All Course": all_course });
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const ID = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === ID && c.published);
  if (course) {
    req.user.purchasedCourses.push(ID);
    res.json({ msg: "course purchesed sucsessfully" });
  } else {
    res.json({ msg: "course not found!" });
  }
});

app.get("/users/purchasedCourses", userAuthentication,(req, res) => {
  // logic to view purchased courses //
  const purchesedCourseIDs = req.user.purchasedCourses
  const purchasedCourses = COURSES.filter(c=>purchesedCourseIDs.includes(c.id))
  res.json({msg:purchasedCourses})
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
