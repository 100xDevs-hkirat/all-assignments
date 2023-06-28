const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let courseId = 100;

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const isExisted = ADMINS.find((user) => user.username == username);
  if (!isExisted) {
    ADMINS.push({ username, password });
    res.send({ message: "admin created successfully" });
  } else res.send("user already existed");
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isExisted = ADMINS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) res.send({ message: "logged in successfully" });
  else res.send("error in credentials");
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const isExisted = ADMINS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    const { title, description, price, imageLink, published } = req.body;
    COURSES.push({
      courseId: courseId,
      title,
      description,
      price,
      imageLink,
      published,
    });
    courseId++;
    res.send({ message: "course created successfully", courseId });
  } else {
    res.send("error in creating course");
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  const isExisted = ADMINS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    //const { title, description, price, imageLink, published } = req.body;
    const courseId = req.params.courseId;
    const getCourse = COURSES.find((course) => course.courseId === courseId);
    if (getCourse) {
      const keys = Object.keys(getCourse);
      for (let key of keys) {
        getCourse[key] = re.body[key];
      }
    }
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  const isExisted = ADMINS.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    res.send({ courses: COURSES });
  } else {
    res.send("incorrect details");
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const isExisted = USERS.find((user) => user.username === username);
  if (!isExisted) {
    USERS.push({ username, password, coursesPurchased: [] });
  } else res.send("user already existed");
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const isExisted = COURSES.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) res.send({ message: "logged in successfully" });
  else res.send("error in credentials");
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  const { username, password } = req.headers;
  const isExisted = COURSES.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    res.send({ courses: COURSES });
  } else {
    res.send("error in credentials");
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const { username, password } = req.headers;
  const isExisted = COURSES.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    const course = COURSES.find(
      (course) => course.courseId === req.params.courseId
    );
    if (course) {
      if (!isExisted.coursesPurchased.includes(Number(req.params.courseId))) {
        isExisted.coursesPurchased.push(req.params.courseId);
        res.send({ course: course });
      } else {
        res.send("course already bought");
      }
    } else res.send("requested course unavialable");
  } else res.send("please log in to view the course");
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;
  const isExisted = COURSES.find(
    (user) => user.username === username && user.password === password
  );
  if (isExisted) {
    const coursesBoughtIds = isExisted.coursesPurchased;
    const coursesBoughtNames = COURSES.filter((course) => {
      if (coursesBoughtIds.includes(course.courseId)) return course;
    });
    res.send({ message: "purchased courses", coursesBoughtNames });
  } else res.send("error in log in");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
