const express = require("express");
//const bodyparser = require("body-parser");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const loginMiddleware = (req, res, next) => {
  let { username, password } = req.headers;
  let adminId = ADMINS.findIndex((admin) => admin.username === username);

  if (ADMINS.findIndex((admin) => admin.username === username) == -1) {
    return res.status(409).send("User doesn't exist");
  } else if (
    ADMINS[adminId].username === username &&
    ADMINS[adminId].password === password
  ) {
    next();
  }

  return res.status(403).send("User Id or Password is incorrect");
};

const isAdmin = (req, res, next) => {
  if (ADMINS.findIndex((admin) => admin.username === res.body.username) != -1) {
    next();
  }
  return res.status(403).send("You are not an admin");
};
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let { username, password } = req.body;

  if (ADMINS.findIndex((admin) => admin.username === username) != -1) {
    return res.status(409).send("User id already exists");
  }

  ADMINS.push({ username: username, password: password });
  return res.status(200).json({ message: "Admin created successfully" });
});

app.post("/admin/login", loginMiddleware, isAdmin, (req, res) => {
  // logic to log in admin
  return res.status(200).json({ message: "Admin Logged in successfully" });
});

app.post("/admin/courses", loginMiddleware, isAdmin, (req, res) => {
  // logic to create a course
  //Body: { title: 'course title', description: 'course description',
  //price: 100, imageLink: 'https://linktoimage.com', published: true }

  let course = req.body;
  if (course) {
    course.courseId = COURSES.length + 1;
    COURSES.push(course);
  }

  res.status(200).json({
    message: "Course created successfully",
    courseId: course.courseId,
  });
});

app.put("/admin/courses/:courseId", loginMiddleware, isAdmin, (req, res) => {
  //Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink:
  //'https://updatedlinktoimage.com', published: false }
  //Output: { message: 'Course updated successfully' }
  // logic to edit a course

  let course = req.body;
  let courseId = req.params.courseId;

  let courseIndex = COURSES.findIndex((course) => course.courseId === courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }
  COURSES[courseIndex].title = course.title;
  COURSES[courseIndex].description = course.description;
  COURSES[courseIndex].imageLink = course.imageLink;
  COURSES[courseIndex].published = course.published;

  return res.status(200).json({ message: "Course updated successfully" });
});

app.get("/admin/courses", loginMiddleware, isAdmin, (req, res) => {
  // logic to get all courses
  return res.status(200).json(COURSES[courseIndex]);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user

  let { username, password } = req.body;

  if (USERS.findIndex((user) => user.username === username) != -1) {
    return res.status(409).json({ message: "User id already exists" });
  }

  USERS.push({ username: username, password: password, purchasedCourses: [] });
  return res.status(200).json({ message: "User created successfully" });
});

app.post("/users/login", loginMiddleware, (req, res) => {
  // logic to log in user
  return res.status(200).json({ message: "User Logged in successfully" });
});

app.get("/users/courses", loginMiddleware, (req, res) => {
  // logic to list all courses
  return res.status(200).json(COURSES);
});

app.post("/users/courses/:courseId", loginMiddleware, (req, res) => {
  // logic to purchase a course
  let course = req.body;
  let courseId = req.params.courseId;

  let courseIndex = COURSES.findIndex((course) => course.courseId === courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  USERS[
    USERS.findIndex((user) => user.username === req.headers[username])
  ].purchasedCourses.push(COURSES[courseIndex]);

  return res.status(200).json({ message: "Course purchased successfully" });
});

app.get("/user/courses", loginMiddleware, isAdmin, (req, res) => {
  // logic to get all courses
  return res.status(200).json(COURSES[courseIndex]);
});

app.get("/users/purchasedCourses", loginMiddleware, (req, res) => {
  // logic to view purchased courses
  return res
    .status(200)
    .json(
      USERS[USERS.findIndex((user) => user.username === req.headers[username])]
        .purchasedCourses
    );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
