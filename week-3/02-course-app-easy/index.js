const express = require("express");
const body_parser = require("body-parser");
const app = express();

app.use(express.json());
app.use(body_parser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let idCounter = 0;

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.headers;
  ADMINS.push({
    username: username,
    password: password,
  });
  console.log(ADMINS);
  res.json({ message: "Admin created successfully" });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username === username && admin.password === password
  );

  if (isPresent) {
    res.json({ message: "Logged in successfully" });
  } else {
    res.status(400).json({ error: "Please enter correct credentials" });
  }
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  if (isPresent) {
    const { title, description, price, imageLink, published } = req.body;
    COURSES.push({
      id: ++idCounter,
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
      published: published,
    });
    console.log(COURSES);
    res.json({ message: "Course created successfully", courseId: idCounter });
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  const updateId = parseInt(req.params.courseId);
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );
  if (isPresent) {
    let isUpdated = false;

    for (let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id == updateId) {
        COURSES[i].title = req.body.title;
        COURSES[i].description = req.body.description;
        COURSES[i].price = req.body.price;
        COURSES[i].imageLink = req.body.imageLink;
        COURSES[i].published = req.body.published;
        isUpdated = true;
        break;
      }
    }
    if (isUpdated) res.json({ message: "Course updated successfully" });
    else {
      res.status(400).json({ error: "The requested course is not present" });
    }
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  const isPresent = ADMINS.some(
    (admin) => admin.username == username && admin.password == password
  );

  if (isPresent) {
    res.json({ courses: COURSES });
  } else {
    res.status(400).json({ error: "Please enter correct admin credentials" });
  }
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.headers;
  USERS.push({
    username: username,
    password: password,
    purchasedCoursesIds: [],
  });
  res.json({ message: "User created successfully" });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const isPresent = USERS.some(
    (user) => user.username == username && user.password == password
  );

  if (isPresent) {
    res.json({ message: "Logged in successfully" });
  } else {
    res.status(400).json({ error: "Please enter correct credentials" });
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  const { username, password } = req.headers;
  const isPresent = USERS.some(
    (user) => user.username == username && user.password == password
  );

  if (isPresent) {
    res.json({ courses: COURSES });
  } else {
    res.status(400).json({ error: "Please enter correct user credentials" });
  }
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const { username, password } = req.headers;
  const purchasedCourseId = parseInt(req.params.courseId);

  const user = USERS.find(
    (user) => user.username == username && user.password == password
  );

  const isCoursePresent = COURSES.some(
    (course) => course.id == purchasedCourseId
  );

  if (user && isCoursePresent) {
    user.purchasedCoursesIds.push(purchasedCourseId);
    console.log(USERS);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(400).json({ error: "Please enter correct details" });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;
  const purchasedCourses = [];

  const user = USERS.find(
    (user) => user.username == username && user.password == password
  );

  if (user) {
    for (let i = 0; user.purchasedCoursesIds.length; i++) {
      const course = COURSES.find(
        (course) => course.id === user.purchasedCoursesIds[i]
      );
      if (course) {
        purchasedCourses.push(course);
        break;
      }
    }
    res.json({ purchasedCourses: purchasedCourses });
  } else {
    res.status(400).json({ error: "Please enter correct user credentials" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
