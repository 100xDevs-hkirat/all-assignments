const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next){
  next();
}
function userAuthentication(req, res, next){
  next();
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  res.send("Logged in successfully");
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message:"Course created successfully", courseId:course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = req.params.courseId;
  const courseExists = COURSES.find(course => course.id.toString() === courseId);
  if(courseExists) {
    const newCourse = req.body;
    const courseIdx = COURSES.findIndex(course => course.id.toString() === courseId);
    newCourse.id = courseId;
    COURSES[courseIdx] = newCourse;
    res.json({ message:"Course updated successfully" });
  } else {
    res.status(404).json({ message:"Course doesn't exist" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  if(COURSES) {
    res.json(JSON.stringify(COURSES));
  } else {
    res.status(404).json({ message: "No course available" });
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  const user = req.body ;
  const userExists = USERS.find(u => u.username === user.username);
  if(userExists) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  if(COURSES){
    res.json(JSON.stringify(COURSES));
  } else {
    res.status(404).json({ message: "No courses available" });
  }
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = req.params.courseId;
  const course = COURSES.find(course => course.id.toString() === courseId);
  if(course) {
    const userIdx = USERS.findIndex(u => u.username === req.headers.username);
    if(!USERS[userIdx].courses) {
      USERS[userIdx].courses = [];
    }
    USERS[userIdx].courses.push(course);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  const user = USERS.find(u => u.username === req.headers.username);
  if(user && 'courses' in user) {
    res.json(JSON.stringify(user.courses));
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
