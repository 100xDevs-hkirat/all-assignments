const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;

  const isRequestBodyValid = sanityCheck([username, password]);
  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }
  const filteredAdminList = filterAdmin(username, password);

  const filteredUserList = filterUser(username, password);

  if (filteredAdminList.length > 0 || filteredUserList.length > 0) {
    res.status(400).send("Username taken");
  } else {
    ADMINS.push({
      username: username,
      password: password,
    });
    res.status(201).send({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  const isRequestBodyValid = sanityCheck([username, password]);
  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }
  const filteredAdminList = filterAdmin(username, password);

  if (filteredAdminList.length === 0) {
    res.status(401).send("Unauthorized");
  } else {
    res.send({ message: "Logged in successfully" });
  }
});

app.post("/admin/courses", authMiddleware, (req, res) => {
  const { title, description, price, published, imageLink } = req.body;

  const isRequestBodyValid = sanityCheck([
    title,
    description,
    price,
    published,
    imageLink,
  ]);

  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }
  // Generate a random number for courseId
  const courseId = Math.floor(Math.random() * 100000);

  COURSES.push({
    title: title,
    description: description,
    price: price,
    published: published,
    imageLink: imageLink,
    courseId: courseId,
  });

  res
    .status(201)
    .send({ message: "Course created successfully", courseId: courseId });
});

app.put("/admin/courses/:courseId", authMiddleware, (req, res) => {
  const { title, description, price, published, imageLink } = req.body;

  const courseId = req.params.courseId;

  const isRequestBodyValid = sanityCheck([
    title,
    description,
    price,
    published,
    imageLink,
  ]);

  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }

  let validCourseId = false;

  const updatedCourses = COURSES.reduce((acc, curr) => {
    if (curr.courseId.toString() === courseId) {
      acc.push({
        title: title,
        description: description,
        price: price,
        published: published,
        imageLink: imageLink,
        courseId: curr.courseId,
      });

      // update flag
      validCourseId = true;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  if (!validCourseId) {
    res.status(404).send("Not found");
  } else {
    COURSES = updatedCourses;
    res.send({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", authMiddleware, (req, res) => {
  res.send(COURSES);
});

// User routes
app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;

  const isRequestBodyValid = sanityCheck([username, password]);

  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }
  const filteredUserList = filterUser(username, password);
  const filteredAdminList = filterAdmin(username, password);

  if (filteredUserList.length > 0 || filteredAdminList.length > 0) {
    res.status(400).send("Username taken");
  } else {
    USERS.push({
      username: username,
      password: password,
      courses: [],
    });
    res.status(201).send({ message: "User created successfully" });
  }
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  const isRequestBodyValid = sanityCheck([username, password]);

  if (!isRequestBodyValid) {
    return res.status(400).send("Bad Request");
  }

  const filteredUserList = filterUser(username, password);

  if (filteredUserList.length === 0) {
    res.status(401).send("Unauthorized");
  } else {
    res.send({ message: "Logged in successfully" });
  }
});

app.get("/users/courses", authMiddleware, (req, res) => {
  res.send(COURSES);
});

app.post("/users/courses/:courseId", authMiddleware, (req, res) => {
  const courseId = req.params.courseId;
  const course = COURSES.filter(
    (course) => course.courseId === parseInt(courseId)
  );

  if (course.length === 0) {
    res.status(404).send("Not found");
  } else {
    if (req.user.courses.includes(courseId)) {
      return res.send({ message: "Course already purchased" });
    }

    USERS = USERS.filter((user) => user.username !== req.user.username);

    USERS.push({ ...req.user, courses: [...req.user.courses, courseId] });

    res.send({ message: "Course purchased successfully" });
  }
});

app.get("/users/purchasedCourses", authMiddleware, (req, res) => {
  const courses = req.user.courses;
  res.send(courses);
});

// Middleware functions

function authMiddleware(req, res, next) {
  const { username, password } = req.headers;

  const validHeaders = sanityCheck([username, password]);

  if (!validHeaders) {
    return res.status(400).send("Bad Request");
  }

  const url = req.url;

  const role = url.split("/")[1] === "admin" ? "admin" : "user";

  const filteredList =
    role === "admin"
      ? filterAdmin(username, password)
      : filterUser(username, password);

  if (filteredList.length < 1) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  req.user = filteredList[0];

  next();
}

// Helper functions

function filterAdmin(username, password) {
  return ADMINS.filter(
    (admin) => admin.username === username && admin.password === password
  );
}

function filterUser(username, password) {
  return USERS.filter(
    (user) => user.username === username && user.password === password
  );
}

function sanityCheck(arr) {
  for (i in arr) {
    if (!arr[i]) {
      return false;
    }
  }
  return true;
}

module.exports = app;
